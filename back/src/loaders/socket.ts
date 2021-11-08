import wsModule from 'ws';
import express from 'express';
import Logger from './logger';

import { IStockInformation } from '../interfaces/stockInformation';
import { ISocketRequest } from '../interfaces/socketRequest';

import StockService from '../services/StockService';

const socketClientMap = new Map();
const translateRequestFormat = (data) => JSON.parse(data);
const translateResponseFormat = (data) => JSON.stringify(data);

export default (app: express.Application): void => {
	const HTTPServer = app.listen(process.env.SOCKET_PORT || 3333, () => {
		Logger.info(
			`✌️ Socket loaded at port:${process.env.SOCKET_PORT || 3333}`,
		);
	});

	const webSocketServer = new wsModule.Server({ server: HTTPServer });
	const broadcast = () => {
		const stockService = new StockService();
		const stockList = stockService.getStocksCurrent();

		webSocketServer.clients.forEach((client) => {
			client.send(
				translateResponseFormat({ type: 'stocks', data: stockList }),
			);
			const targetStock = socketClientMap.get(client);
			if (targetStock) {
				client.send(
					translateResponseFormat({
						type: 'info',
						data: targetStock,
					}),
				);
			}
		});
	};
	setInterval(() => {
		broadcast();
	}, 1000);

	webSocketServer.on('connection', (ws, req) => {
		ws.on('message', (message: string) => {
			const requestData: ISocketRequest = translateRequestFormat(
				message,
			) || { type: 'error' };
			if (requestData.type === 'open') {
				socketClientMap.set(ws, requestData.stock);
			}

			if (requestData.type === 'close') {
				socketClientMap.delete(ws);
			}
		});
		ws.on('close', () => {});
	});
};
