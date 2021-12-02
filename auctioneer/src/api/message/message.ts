/* eslint-disable no-await-in-loop */
import express, { NextFunction, Request, Response } from 'express';
import { AuctioneerService } from '@services/index';
import { ParamError, ParamErrorMessage } from '@errors/index';
import eventEmitter from '@helper/eventEmitter';

export default (): express.Router => {
	const router = express.Router();

	router.get('/bid', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { code } = req.query;
			if (code === undefined) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
			eventEmitter.emit('WAITING', code);
			res.end();
		} catch (error) {
			next(error);
		}
	});

	return router;
};
