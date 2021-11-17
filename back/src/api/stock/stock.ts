import OrderService from '@services/OrderService';
import express, { Request, Response } from 'express';
import Emitter from '../../helper/eventEmitter';

export default (): express.Router => {
	const router = express.Router();
	router.post('/conclusion', async (req: Request, res: Response) => {
		const msg = req.body;
		const { code: stockCode, id: stockId } = msg.match;
		const orderServiceInstance = new OrderService();

		msg.bidAsk = await orderServiceInstance.getBidAskOrders(stockId);
		Emitter.emit('broadcast', { stockCode, msg });
		res.end();
	});

	return router;
};
