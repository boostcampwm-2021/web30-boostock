import express, { Request, Response } from 'express';
import { code2StockId } from '@api/middleware/middleware';
import { AuctioneerService } from '@services/index';
import { CommonError } from '@services/errors/index';
import { QueryRunner, transaction } from '@helper/tools';

export default (): express.Router => {
	const router = express.Router();

	router.get('/bid', code2StockId, async (req: Request, res: Response) => {
		const { stockId } = res.locals.stockId;
		const autioneerServiceInstance = new AuctioneerService();
		const result = await autioneerServiceInstance.bid(parseInt(stockId, 10));
		res.status(200).json(result).end();
	});

	router.get('/ask', code2StockId, (req: Request, res: Response) => {
		const { stockId } = req.query;
		const auctioneerServiceInstance = new AuctioneerService();
		// const result = auctioneerServiceInstance.ask(code as string);
		// res.status(200).json(result).end();
	});

	return router;
};
