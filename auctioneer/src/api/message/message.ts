/* eslint-disable no-await-in-loop */
import express, { Request, Response } from 'express';
import { code2StockId } from '@api/middleware/middleware';
import { AuctioneerService } from '@services/index';

export default (): express.Router => {
	const router = express.Router();

	router.get('/bid', code2StockId, async (req: Request, res: Response) => {
		const { stockId, code } = res.locals;
		const autioneerServiceInstance = new AuctioneerService();
		res.status(200).json({});
		while (await autioneerServiceInstance.bidAsk(stockId, code));
	});

	router.get('/ask', code2StockId, async (req: Request, res: Response) => {
		const { stockId, code } = res.locals;
		const autioneerServiceInstance = new AuctioneerService();
		res.status(200).json({});
		while (await autioneerServiceInstance.bidAsk(stockId, code));
	});

	return router;
};
