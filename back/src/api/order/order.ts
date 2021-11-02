import express, { Request, Response } from 'express';
import Order from '@models/Order';
import OrderService from '@services/OrderService';

export default (): express.Router => {
	const router = express.Router();

	router.get('/', async (req: Request, res: Response) => {
		res.status(500).end();
		/* TODO: GET
		const orderServiceInstance = new OrderService();
		console.log(req.query.user_id, Number.isNaN(req.query.user_id));
		orderServiceInstance
			.search({
				userId: req.query.user_id
					? Number(req.query.user_id)
					: undefined,
				stockId: req.query.stock_id
					? Number(req.query.stock_id)
					: undefined,
				type: req.query.type ? Number(req.query.type) : undefined,
				amount: req.query.amount ? Number(req.query.amount) : undefined,
				price: req.query.price ? Number(req.query.price) : undefined,
				offset: req.query.offset ? Number(req.query.offset) : undefined,
				limit: req.query.limit ? Number(req.query.limit) : undefined,
			})
			.then((orders: Order[]) => {
				res.status(200).json(orders).end();
			})
			.catch(() => {
				res.status(500).end();
			});
		*/
	});

	router.post('/', async (req: Request, res: Response) => {
		const orderServiceInstance = new OrderService();
		orderServiceInstance
			.order({
				userId: req.body.user_id,
				stockId: req.body.stock_id,
				type: req.body.type,
				amount: req.body.amount,
				price: req.body.price,
			})
			.then(() => {
				res.status(200).end();
			})
			.catch(() => {
				res.status(500).end();
			});
	});

	router.delete('/', async (req: Request, res: Response) => {
		const orderServiceInstance = new OrderService();
		orderServiceInstance
			.cancel(req.body.order_id)
			.then(() => {
				res.status(200).end();
			})
			.catch(() => {
				res.status(500).end();
			});
	});

	router.put('/', async (req: Request, res: Response) => {
		const orderServiceInstance = new OrderService();
		orderServiceInstance
			.modify(req.body.order_id, {
				amount: req.body.amount,
				price: req.body.price,
			})
			.then(() => {
				res.status(200).end();
			})
			.catch(() => {
				res.status(500).end();
			});
	});

	return router;
};
