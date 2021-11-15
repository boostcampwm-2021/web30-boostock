import express from 'express';
import * as expressSession from 'express-session';
import expressMysqlSession from 'express-mysql-session';

import config from '@config/index';
import sessionStoreConfig from '../../sessionStoreConfig.json';

declare module 'express-session' {
	interface SessionData {
		data: { [key: string]: string };
	}
}

export default function session(): express.Application {
	const app = express();
	const MySQLStore = expressMysqlSession(expressSession);
	const sessionStore = new MySQLStore(sessionStoreConfig);
	app.use(
		expressSession.default({
			secret: config.sessionSecret as string,
			resave: false,
			saveUninitialized: false,
			rolling: true,
			store: sessionStore,
			cookie: {
				path: '/',
				httpOnly: false,
				secure: false,
				maxAge: config.maxAge,
			},
		}),
	);
	return app;
}
