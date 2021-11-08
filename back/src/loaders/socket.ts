import wsModule from 'ws';
import express from 'express';
import Logger from './logger';

import { IStockInformation } from '../interfaces/stockInformation';
import { ISocketRequest } from '../interfaces/socketRequest';

const socketClientMap = new Map();
const stockInformation: Map<string, IStockInformation> = new Map([
	[
		'Boostock',
		{
			name: 'Boostock',
			current: 3000,
		},
	],
]);
const translateRequestFormat = (data) => JSON.parse(data);
const translateResponseFormat = (data) => JSON.stringify(data);

export default (app: express.Application): void => {
	const HTTPServer = app.listen(process.env.SOCKET_PORT || 3333, () => {
		Logger.info(
			`✌️ Socket loaded at port:${process.env.SOCKET_PORT || 3333}`,
		);
	});

	const webSocketServer = new wsModule.Server({ server: HTTPServer });
	const broadcast = (clients) => {
		clients.forEach((stock, client) => {
			const response = stockInformation.get(stock);
			client.send(translateResponseFormat(response));
		});
	};
	setInterval(() => {
		broadcast(socketClientMap);
	}, 1000);

	webSocketServer.on('connection', (ws, req) => {
		ws.on('message', (message: string) => {
			const requestData: ISocketRequest = translateRequestFormat(
				message,
			) || { type: 'error' };
			if (requestData.type === 'open') {
				socketClientMap.set(ws, requestData.stock);
			}
		});
		ws.on('close', () => {
			socketClientMap.delete(ws);
		});
	});
};
