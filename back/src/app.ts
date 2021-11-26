import express from 'express';
import fs from 'fs';
import _http from 'http';
import _https from 'https';

import Logger from '@loaders/logger';
import loaders from '@loaders/index';
import config from '@config/index';

async function startHttpServer() {
	const app = express();
	const http = _http.createServer(app);
	await loaders({ expressApp: app });

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

async function startHttpsServer() {
	const app = express();
	const https = _https.createServer(
		{
			ca: fs.readFileSync('/etc/ssl/ca_bundle.crt'),
			key: fs.readFileSync('/etc/ssl/private.key'),
			cert: fs.readFileSync('/etc/ssl/certificate.crt'),
		},
		app,
	);
	await loaders({ expressApp: app });

	https
		.listen(config.port, () => {
			Logger.info(`
    	################################################
    	🛡️  Server listening on port: ${config.port} 🛡️
    	################################################
      `);
		})
		.on('error', (err) => {
			Logger.error(err);
			process.exit(1);
		});
}

if (process.env.NODE_ENV === 'production') startHttpsServer();
else startHttpServer();
