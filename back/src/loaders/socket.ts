import wsModule from 'ws';
import express from 'express';
import Emitter from '@helper/eventEmitter';
import { binArrayToJson, JsonToBinArray, QueryRunner, transaction } from '@helper/tools';
import { CommonError } from '@services/errors/index';
import Logger from './logger';
import { ISocketRequest } from '../interfaces/socketRequest';
import StockService from '../services/StockService';

const socketClientMap = new Map();

const translateRequestFormat = (data) => binArrayToJson(data);
const translateResponseFormat = (type, data) => JsonToBinArray({ type, data });

const connectNewUser = (client) => {
	transaction((queryRunner: QueryRunner, commit: () => void, rollback: (err: CommonError) => void, release: () => void) => {
		const stockService = new StockService();
		stockService
			.getStocksCurrent(queryRunner.manager)
			.then((stockList) => {
				client.send(translateResponseFormat('stocksInfo', stockList));
				socketClientMap.set(client, '');
				commit();
			})
			.catch((error) => {
				client.send(translateResponseFormat('error', '종목 리스트를 받아올 수 없습니다.'));
				rollback(error);
			})
			.finally(release);
	});
};

export default async (app: express.Application): Promise<void> => {
	const HTTPServer = app.listen(process.env.SOCKET_PORT || 3333, () => {
		Logger.info(`✌️ Socket loaded at port:${process.env.SOCKET_PORT || 3333}`);
	});
	const webSocketServer = new wsModule.Server({ server: HTTPServer });
	webSocketServer.binaryType = 'arraybuffer';

	const broadcast = ({ stockCode, msg }) => {
		socketClientMap.forEach((targetStockCode, client) => {
			if (targetStockCode === stockCode) {
				// 모든 데이터 전송, 현재가, 호가, 차트 등...
				client.send(translateResponseFormat('updateTarget', msg));
			} else {
				// msg 오브젝트의 데이터에서 aside 바에 필요한 데이터만 골라서 전송
				client.send(translateResponseFormat('updateStock', msg.match));
			}
		});
	};

	Emitter.on('broadcast', broadcast);
	Emitter.on('order accepted', broadcast);

	webSocketServer.on('connection', (ws, req) => {
		connectNewUser(ws);

		ws.on('message', async (message: string) => {
			const requestData: ISocketRequest = translateRequestFormat(message);

			switch (requestData.type) {
				case 'open': {
					if (!socketClientMap.has(ws)) return;
					const stockService = new StockService();
					const stockCode = requestData.stockCode ?? '';
					const conclusions = await stockService.getConclusionByCode(stockCode);

					ws.send(translateResponseFormat('baseStock', { conclusions, charts: [] }));
					socketClientMap.set(ws, stockCode);
					break;
				}
				case 'close': {
					socketClientMap.delete(ws);
					break;
				}
				default:
					ws.send(translateResponseFormat('error', '알 수 없는 오류가 발생했습니다.'));
			}
		});

		ws.on('close', () => {});
	});
};
