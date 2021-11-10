import wsModule from 'ws';
import express from 'express';
import Emitter from '@helper/eventEmitter';
import { QueryRunner, transaction } from '@helper/tools';
import { CommonError } from '@services/errors/index';
import Logger from './logger';
import moment from '../helper/moment';

import { IStockInformation } from '../interfaces/stockInformation';
import { ISocketRequest } from '../interfaces/socketRequest';

import StockService from '../services/StockService';

const socketClientMap = new Map();
const translateRequestFormat = (data) => JSON.parse(data);
const translateResponseFormat = (type, data) => JSON.stringify({ type, data });
const connectNewUser = (client) => {
	transaction(
		(
			queryRunner: QueryRunner,
			commit: () => void,
			rollback: (err: CommonError) => void,
			release: () => void,
		) => {
			const stockService = new StockService();
			stockService
				.getStocksCurrent(queryRunner.manager)
				.then((stockList) => {
					client.send(
						translateResponseFormat('stocks_info', stockList),
					);
					socketClientMap.set(client, '');
					commit();
				})
				.catch((error) => {
					client.send(
						translateResponseFormat(
							'error',
							'종목 리스트를 받아올 수 없습니다.',
						),
					);
					rollback(error);
				})
				.finally(release);
		},
	);
};

export default (app: express.Application) => {
	const HTTPServer = app.listen(process.env.SOCKET_PORT || 3333, () => {
		Logger.info(
			`✌️ Socket loaded at port:${process.env.SOCKET_PORT || 3333}`,
		);
	});
	const webSocketServer = new wsModule.Server({ server: HTTPServer });
	const broadcast = ({ stockCode, msg }) => {
		socketClientMap.forEach((targetStockCode, client) => {
			if (targetStockCode === stockCode) {
				// 모든 데이터 전송, 현재가, 호가, 차트 등...
				client.send(translateResponseFormat('update_target', msg));
			} else {
				// msg 오브젝트의 데이터에서 aside 바에 필요한 데이터만 골라서 전송
				client.send(translateResponseFormat('update_stock', msg.data));
			}
		});
	};
	Emitter.on('broadcast', broadcast);

	webSocketServer.on('connection', (ws, req) => {
		connectNewUser(ws);

		ws.on('message', (message: string) => {
			const requestData: ISocketRequest = translateRequestFormat(message);

			switch (requestData.type) {
				case 'open':
					console.log('open');
					if (!socketClientMap.has(ws)) return;
					socketClientMap.set(ws, requestData.stockCode);
					break;
				case 'close':
					socketClientMap.delete(ws);
					break;
				case 'reconnect':
					// 모든 종목 기초 데이터 재전송
					break;
				default:
					ws.send(
						translateResponseFormat(
							'error',
							'알 수 없는 오류가 발생했습니다.',
						),
					);
			}
		});

		ws.on('close', () => {});
	});
};
