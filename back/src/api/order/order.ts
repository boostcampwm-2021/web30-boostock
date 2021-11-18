import fetch from 'node-fetch';
import express, { NextFunction, Request, Response } from 'express';
import Emitter from '@helper/eventEmitter';
import { OrderService } from '@services/index';
import { AuthError, AuthErrorMessage, ParamError, ParamErrorMessage } from '@services/errors/index';
import { stockIdValidator } from '@api/middleware/orderValidator';

export default (): express.Router => {
	const router = express.Router();

	router.post('/', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const { stockCode, type, amount, price } = req.body;
			if (!stockCode || !type || !amount || !price) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
			await OrderService.order(userId, stockCode, type, amount, price);
			fetch(`${process.env.AUCTIONEER_URL}/api/message/bid?code=${req.body.stockCode}`);

			const acceptedOrderInfo = {
				stockCode,
				msg: {
					order: {
						type,
						amount,
						price,
					},
				},
			};
			Emitter.emit('order accepted', acceptedOrderInfo);
			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	});

	router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const { orderId } = req.body;
			if (!orderId) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
			await OrderService.cancel(userId, orderId);
			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	});

	router.put('/', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.session.data?.userId;
			if (userId === undefined) throw new AuthError(AuthErrorMessage.INVALID_SESSION);
			const { orderId, amount, price } = req.body;
			if (!orderId || !amount || !price) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
			await OrderService.modify(userId, orderId, amount, price);
			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	});

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
