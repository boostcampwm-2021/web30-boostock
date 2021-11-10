import wsModule from 'ws';
import express from 'express';
import Logger from './logger';
import moment from '../helper/moment';

import { IStockInformation } from '../interfaces/stockInformation';
import { ISocketRequest } from '../interfaces/socketRequest';

import StockService from '../services/StockService';
import Emitter from '../helper/eventEmitter';

const socketClientMap = new Map();
const translateRequestFormat = (data) => JSON.parse(data);
const translateResponseFormat = (type, data) => JSON.stringify({ type, data });

export default (app: express.Application) => {
	const HTTPServer = app.listen(process.env.SOCKET_PORT || 3333, () => {
		Logger.info(
			`✌️ Socket loaded at port:${process.env.SOCKET_PORT || 3333}`,
		);
	});
	const webSocketServer = new wsModule.Server({ server: HTTPServer });
	const broadcast = ({ stockCode, msg }) => {
		webSocketServer.clients.forEach((client) => {
			const targetStockCode = socketClientMap.get(client);
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
		socketClientMap.set(ws, '');
		const stockService = new StockService();
		const stockList = stockService.getStocksCurrent();
		ws.send(translateResponseFormat('stocks_info', stockList));

		ws.on('message', (message: string) => {
			const requestData: ISocketRequest = translateRequestFormat(message);

			switch (requestData.type) {
				case 'open':
					socketClientMap.set(ws, requestData.stockCode);
					break;
				case 'close':
					socketClientMap.delete(ws);
					break;
				default:
					ws.send({
						type: 'error',
						msg: '알 수 없는 오류가 발생했습니다.',
					});
					break;
			}
		});

		ws.on('close', () => {});
	});
};
