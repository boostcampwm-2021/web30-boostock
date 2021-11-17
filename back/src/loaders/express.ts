import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import api from '@api/index';
import config from '@config/index';
import { CommonError, CommonErrorMessage, NotFoundError, NotFoundErrorMessage } from '@services/errors';
import loggers from '@loaders/logger';
import session from './session';

export default async ({ app }: { app: express.Application }): Promise<void> => {
	app.get('/status', (req, res) => {
		res.status(200).end();
	});
	app.head('/status', (req, res) => {
		res.status(200).end();
	});

	app.enable('trust proxy');
	app.use(morgan('tiny'));
	app.use(cors({ origin: [config.clientURL, 'http://127.0.0.1'], credentials: true }));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(session());
	app.use('/api', api());

	/// catch 404 and forward to error handler
	app.use((req, res, next) => {
		next(new NotFoundError(NotFoundErrorMessage.NOT_FOUND));
	});

	/// error handlers
	app.use((err: CommonError, req: express.Request, res: express.Response, next: express.NextFunction) => {
		/**
		 * Handle 401 thrown by express-jwt library
		 */
		if (err.name === 'AuthError') {
			return res.status(err.status).send({ code: 5000, message: err.message }).end();
		}
		if (err.name === 'UnauthorizedError') {
			return res.status(err.status).send({ message: err.message }).end();
		}
		if (err instanceof CommonError) {
			return res.status(err.status).send({ message: err.message }).end();
    }
		return next(err);
	});

	app.use((err: Error, req: express.Request, res: express.Response) => {
		loggers.warn(err);
		const commonError = new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return res.status(commonError.status).send({ message: err.message });
	});
};
