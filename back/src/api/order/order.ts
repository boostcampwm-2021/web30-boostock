import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import OrderValidator from '@api/middleware/orderValidator';
import { Order, OrderType } from '@models/index';
import { OrderService } from '@services/index';
import { CommonError } from '@services/errors/index';
import { QueryRunner, transaction, Validator } from '@helper/index';

export default (): express.Router => {
	const router = express.Router();

	router.post('/', OrderValidator, async (req: Request, res: Response) => {
		transaction(
			(queryRunner: QueryRunner, commit: () => void, rollback: (err: CommonError) => void, release: () => void) => {
				const orderServiceInstance = new OrderService();
				orderServiceInstance
					.order(queryRunner.manager, {
						userId: 1,
						stockCode: req.body.stockCode,
						type: req.body.type,
						amount: req.body.amount,
						price: req.body.price,
					})
					.then(() => {
						res.status(200).end();
						commit();
						fetch(`${process.env.AUCTIONEER_URL}/api/message/bid?code=${req.body.stockCode}`);
					})
					.catch(rollback)
					.finally(release);
			},
			req,
			res,
		);
	});

	router.delete('/', async (req: Request, res: Response) => {
		transaction(
			(queryRunner: QueryRunner, then: () => void, err: (err: CommonError) => void, fin: () => void) => {
				const orderServiceInstance = new OrderService();
				const validator = new Validator();
				orderServiceInstance
					.cancel(queryRunner.manager, {
						userId: validator.init(1).isInteger().toNumber(),
						orderId: validator.init(req.body.orderId).isInteger().toNumber(),
					})
					.then(() => {
						res.status(200).end();
						then();
					})
					.catch(err)
					.finally(fin);
			},
			req,
			res,
		);
	});

	router.put('/', async (req: Request, res: Response) => {
		transaction(
			(queryRunner: QueryRunner, then: () => void, err: (err: CommonError) => void, fin: () => void) => {
				const orderServiceInstance = new OrderService();
				const validator = new Validator();
				orderServiceInstance
					.modify(queryRunner.manager, {
						userId: validator.init(1).isInteger().toNumber(),
						orderId: validator.init(req.body.orderId).isInteger().toNumber(),
						amount: validator.init(req.body.amount).isInteger().isPositive().toNumber(),
						price: validator.init(req.body.price).isInteger().isPositive().toNumber(),
					})
					.then(() => {
						res.status(200).end();
						then();
					})
					.catch(err)
					.finally(fin);
			},
			req,
			res,
		);
	});

	return router;
};
