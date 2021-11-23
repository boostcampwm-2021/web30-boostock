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
			eventEmitter.emit('waiting');
			res.end();
		} catch (error) {
			next(error);
		}
	});

	router.get('/ask', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { code } = req.query;
			if (code === undefined) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
			const autioneerServiceInstance = new AuctioneerService();
			res.status(200).json({});
			while (await autioneerServiceInstance.bidAsk(code as string));
		} catch (error) {
			next(error);
		}
	});

	return router;
};
