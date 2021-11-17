import fetch from 'node-fetch';
import express, { NextFunction, Request, Response } from 'express';
import { OrderService } from '@services/index';
import { AuthError, AuthErrorMessage, ParamError, ParamErrorMessage } from '@services/errors/index';

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
		} catch (error) {
			next(error);
		}
	});

	return router;
};
