import express, { Request, Response } from 'express';
import fetch from 'node-fetch';

import { Order } from '@models/index';
import { OrderService } from '@services/index';
import { CommonError } from '@services/errors/index';
import { QueryRunner, transaction } from '@helper/tools';

export default (): express.Router => {
	const router = express.Router();

	router.post('/', async (req: Request, res: Response) => {
		const { userId, stockCode, type, amount, price } = req.body;
		transaction(
			(queryRunner: QueryRunner, commit: () => void, rollback: (err: CommonError) => void, release: () => void) => {
				const orderServiceInstance = new OrderService();
				orderServiceInstance
					.order(queryRunner.manager, {
						userId: Number(1) || 0,
						stockCode,
						type: Number(type) || 0,
						amount: Number(amount) || 0,
						price: Number(price) || 0,
					})
					.then(() => {
						res.status(200).end();
						commit();
						fetch(`${process.env.AUCTIOINEER_URL}/api/message/bid?code=${stockCode}`);
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
				orderServiceInstance
					.cancel(queryRunner.manager, {
						userId: Number(req.cookies.id) || 0,
						orderId: Number(req.body.orderId) || 0,
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
				orderServiceInstance
					.modify(queryRunner.manager, {
						userId: Number(req.cookies.id) || 0,
						orderId: Number(req.body.orderId) || 0,
						amount: Number(req.body.amount) || 0,
						price: Number(req.body.price) || 0,
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
