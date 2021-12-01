import fetch from 'node-fetch';
import express, { NextFunction, Request, Response } from 'express';
import { OrderService, UserService } from '@services/index';
import Emitter from '@helper/eventEmitter';
import { ParamError, ParamErrorMessage } from 'errors/index';
import { orderValidator, stockIdValidator } from '@api/middleware/orderValidator';
import sessionValidator from '@api/middleware/sessionValidator';

export default (): express.Router => {
	const router = express.Router();

	router.get('/order', sessionValidator, async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { userId } = res.locals;
			const { end } = req.query;
			const pendingOrder = await UserService.readPendingOrder(userId, Number(end));

			res.status(200).json({ pendingOrder });
		} catch (error) {
			next(error);
		}
	});

	router.post('/order', sessionValidator, orderValidator, async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { userId } = res.locals;
			const { stockCode, type, amount, price } = req.body;
			await OrderService.order(userId, stockCode, type, amount, price);

			const acceptedOrderInfo = {
				stockCode,
				msg: {
					type,
					amount,
					price,
				},
			};

			res.status(201).json({});
			fetch(`${process.env.AUCTIONEER_URL}/api/message/bid?code=${req.body.stockCode}`);
			Emitter.emit('ACCEPTED_ORDER', acceptedOrderInfo);
		} catch (error) {
			next(error);
		}
	});

	router.delete('/order', sessionValidator, async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { userId } = res.locals;
			const { id, type } = req.query;
			if (!id || !type) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
			await OrderService.cancel(userId, Number(type), Number(id));

			res.status(201).json({});
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

	// trading Bot
	router.post('/border', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { botId: userId, stockCode, type, amount, price } = req.body;
			await OrderService.order(userId, stockCode, type, amount, price);
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

			res.status(200).json({});
			fetch(`${process.env.AUCTIONEER_URL}/api/message/bid?code=${req.body.stockCode}`);
			Emitter.emit('ACCEPTED_ORDER', acceptedOrderInfo);
		} catch (error) {
			next(error);
		}
	});

	return router;
};
