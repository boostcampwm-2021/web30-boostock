import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import api from '@api/index';
import config from '@config/index';

export default async ({ app }: { app: express.Application }) => {
	app.get('/status', (req, res) => {
		res.status(200).end();
	});
	app.head('/status', (req, res) => {
		res.status(200).end();
	});

	app.enable('trust proxy');
	app.use(morgan('tiny'));
	app.use(cors({ origin: config.clientURL, credentials: true }));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());

	app.use('/api', api);

	/// catch 404 and forward to error handler
	app.use((req, res, next) => {
		const err = new Error('Not Found');
		err['status'] = 404;
		next(err);
	});

	/// error handlers
	app.use(
		(
			err: any,
			req: express.Request,
			res: express.Response,
			next: express.NextFunction,
		) => {
			/**
			 * Handle 401 thrown by express-jwt library
			 */
			if (err.name === 'AuthError') {
				return res
					.status(err.status)
					.send({ code: 5000, message: err.message })
					.end();
			}
			if (err.name === 'UnauthorizedError') {
				return res
					.status(err.status)
					.send({ message: err.message })
					.end();
			}
			return next(err);
		},
	);
	app.use((err: any, req: express.Request, res: express.Response) => {
		res.status(err.status || 500);
		res.json({
			errors: {
				message: err.message,
			},
		});
	});
};
