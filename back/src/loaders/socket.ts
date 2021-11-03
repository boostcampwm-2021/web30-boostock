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
	const HTTPServer = app.listen(3333, () => {
		Logger.info('✌️ Socket loaded at port:3333');
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
		const clientIP =
			req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		ws.on('message', (message: string) => {
			const requestData: ISocketRequest = translateRequestFormat(
				message,
			) || { type: 'error' };
			if (requestData.type === 'visited') {
				socketClientMap.set(ws, requestData.stock);
			}
		});
	});
};
