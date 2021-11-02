import wsModule from 'ws';
import express from 'express';
import Logger from './logger';

import { IStockInformation } from '../interfaces/stockInformation';

const translateSocketData = (data) => JSON.stringify(data);

export default (app: express.Application): void => {
	const HTTPServer = app.listen(3333, () => {
		Logger.info('✌️ Socket loaded at port:3333');
	});

	const webSocketServer = new wsModule.Server({ server: HTTPServer });
	const broadcast = (message: string) => {
		webSocketServer.clients.forEach((client) => {
			client.send(message);
		});
	};

	setInterval(() => {
		const message: IStockInformation = {
			name: 'Boostock',
			current: 3000,
		};
		broadcast(translateSocketData(message));
	}, 1000);
};
