import express, { NextFunction, Request, Response } from 'express';

import { OrderService } from '@services/index';
import { stockIdValidator } from '@api/middleware/orderValidator';

export default (): express.Router => {
	const router = express.Router();

	router.get('/bid-ask', stockIdValidator, async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { stockId } = req.query;
			const orderServiceInstance = new OrderService();
			const { askOrders, bidOrders } = await orderServiceInstance.getBidAskOrders(Number(stockId));

			res.status(200).json({ askOrders, bidOrders });
		} catch (error) {
			next(error);
		}
	});

	return router;
};
