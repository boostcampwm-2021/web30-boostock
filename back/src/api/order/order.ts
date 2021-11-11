import express, { Request, Response } from 'express';
import { Order } from '@models/index';
import { OrderService } from '@services/index';
import { CommonError } from '@services/errors/index';
import { QueryRunner, transaction } from '@helper/tools';

export default (): express.Router => {
	const router = express.Router();

	router.post('/', async (req: Request, res: Response) => {
		transaction(
			(queryRunner: QueryRunner, then: () => void, err: (err: CommonError) => void, fin: () => void) => {
				const orderServiceInstance = new OrderService();
				orderServiceInstance
					.order(queryRunner.manager, {
						userId: Number(req.cookies.id) || 0,
						stockCode: req.body.code,
						type: Number(req.body.type) || 0,
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
