import express from 'express';
import _http from 'http';

import Logger from '@loaders/logger';
import loaders from '@loaders/index';
import config from '@config/index';
export const app = express();

async function startServer() {
	const http = _http.createServer(app);
	await loaders({ expressApp: app, http });

	http.listen(config.port, () => {
		Logger.info(`
    	################################################
    	🛡️  Server listening on port: ${config.port} 🛡️
    	################################################
      `);
	}).on('error', (err) => {
		Logger.error(err);
		process.exit(1);
	});
}

startServer();
