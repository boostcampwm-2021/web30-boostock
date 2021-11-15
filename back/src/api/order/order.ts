import express, { query, Request, Response } from 'express';
import fetch from 'node-fetch';

import { Order, OrderType } from '@models/index';
import { OrderService } from '@services/index';
import { CommonError } from '@services/errors/index';
import { QueryRunner, transaction, Validator } from '@helper/index';

export default (): express.Router => {
	const router = express.Router();

	router.get('/bid-ask', async (req: Request, res: Response) => {
		const { stockId } = req.query;

		transaction(
			(queryRunner: QueryRunner, commit: () => void, rollback: (err: CommonError) => void, release: () => void) => {
				const orderServiceInstance = new OrderService();
				const validator = new Validator();

				orderServiceInstance
					.getBidAskOrders(queryRunner.manager, validator.init(stockId).isInteger().isPositive().toNumber())
					.then((data) => {
						res.json(data).end();
						commit();
					})
					.catch(rollback)
					.finally(release);
			},
			req,
			res,
		);
	});

	router.post('/', async (req: Request, res: Response) => {
		transaction(
			(queryRunner: QueryRunner, commit: () => void, rollback: (err: CommonError) => void, release: () => void) => {
				const orderServiceInstance = new OrderService();
				const validator = new Validator();
				orderServiceInstance
					.order(queryRunner.manager, {
						userId: validator.init(1).isInteger().toNumber(),
						stockCode: validator.init(req.body.stockCode).isString().toString(),
						type: validator.init(req.body.type).isInObject(OrderType).isInteger().toNumber(),
						amount: validator.init(req.body.amount).isInteger().isPositive().toNumber(),
						price: validator.init(req.body.price).isInteger().isPositive().toNumber(),
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
