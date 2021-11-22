import OrderService from '@services/OrderService';
import express, { Request, Response } from 'express';
import Emitter from '../../helper/eventEmitter';

export default (): express.Router => {
	const router = express.Router();
	router.post('/conclusion', async (req: Request, res: Response) => {
		const msg = req.body;
		const orderServiceInstance = new OrderService();
		const { code: stockCode, stockId } = msg.match;
		msg.bidAsk = await orderServiceInstance.getBidAskOrders(stockId);
		const { bidUser, askUser, ...matchMessage } = msg.match;
		const broadcastMessage = { ...msg, match: matchMessage };
		res.end();

		Emitter.emit('broadcast', { stockCode, msg: broadcastMessage });
		Emitter.emit('notice', bidUser, { userType: 'ask', stockCode });
		Emitter.emit('notice', askUser, { userType: 'bid', stockCode });
	});

	return router;
};
