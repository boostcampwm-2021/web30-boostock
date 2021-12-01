import OrderService from '@services/OrderService';
import StockService from '@services/StockService';
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

		Emitter.emit('BROADCAST', { stockCode, msg: broadcastMessage });
		Emitter.emit('NOTICE', bidUser, { userType: 'bid', stockCode });
		Emitter.emit('NOTICE', askUser, { userType: 'ask', stockCode });
	});

	router.post('/chart/new', (req: Request, res: Response) => {
		// 차트데이터를 auctioneer에게서 받아와야 하는가 여기서 chartTable을 한번더 조회하는가
		const { charts } = req.body;
		const stockChartJson = {};
		charts.forEach((stock) => {
			stockChartJson[stock.code] = stock;
		});

		res.end();

		Emitter.emit('CHART', stockChartJson);
	});

	router.get('/prices', async (req: Request, res: Response) => {
		const stockService = new StockService();
		const stockList = await stockService.getPriceStockAll();

		res.status(200).json({ stocks: stockList });
	});

	return router;
};
