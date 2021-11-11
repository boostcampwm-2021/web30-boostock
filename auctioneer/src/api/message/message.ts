import express, { Request, Response } from 'express';
import { code2StockId } from '@api/middleware/middleware';
import { AuctioneerService } from '@services/index';

export default (): express.Router => {
	const router = express.Router();

	router.get('/bid', code2StockId, async (req: Request, res: Response) => {
		const { stockId, code } = res.locals;
		const autioneerServiceInstance = new AuctioneerService();
		// eslint-disable-next-line no-await-in-loop
		while (await autioneerServiceInstance.bidAsk(stockId, code));
		res.status(200).end();
	});

	router.get('/ask', code2StockId, async (req: Request, res: Response) => {
		const { stockId, code } = res.locals;
		const autioneerServiceInstance = new AuctioneerService();
		// eslint-disable-next-line no-await-in-loop
		while (await autioneerServiceInstance.bidAsk(stockId, code));
		res.status(200).end();
	});

	return router;
};
