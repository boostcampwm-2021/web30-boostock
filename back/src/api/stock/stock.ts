import OrderService from '@services/OrderService';
import StockService from '@services/StockService';
import express, { NextFunction, Request, Response } from 'express';
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
		Emitter.emit('notice', bidUser, { userType: 'bid', stockCode });
		Emitter.emit('notice', askUser, { userType: 'ask', stockCode });
	});

	router.post('/chart/new', async (req: Request, res: Response) => {
		const { charts } = req.body;
		const stockChartJson = {};
		charts.forEach((stock) => {
			stockChartJson[stock.code] = stock;
		});

		res.end();

		Emitter.emit('chart', stockChartJson);
	});

	router.get('/prices', async (req: Request, res: Response) => {
		const stockService = new StockService();
		const stockList = await stockService.getPriceStockAll();

		res.status(200).json({ stocks: stockList });
	});

	return router;
};

/*
[
  {
    code: 'HNX',
    type: 1,
    priceBefore: 0,
    priceStart: 115800,
    priceEnd: 115700,
    priceHigh: 117000,
    priceLow: 115700,
    amount: 58,
    volume: 6729600,
    createdAt: 1637808900043,
    _id: '619efb04e74560355faed6cb',
    __v: 0
  },
  {
    code: 'CRG',
    type: 1,
    priceBefore: 0,
    priceStart: 1002000,
    priceEnd: 995800,
    priceHigh: 1002000,
    priceLow: 993200,
    amount: 42,
    volume: 41907700,
    createdAt: 1637808900044,
    _id: '619efb04e74560355faed6cc',
    __v: 0
  },
  {
    code: 'JK',
    type: 1,
    priceBefore: 0,
    priceStart: 696800,
    priceEnd: 697300,
    priceHigh: 704500,
    priceLow: 696800,
    amount: 40,
    volume: 27949800,
    createdAt: 1637808900045,
    _id: '619efb04e74560355faed6cd',
    __v: 0
  },
  {
    code: 'IVY',
    type: 1,
    priceBefore: 0,
    priceStart: 8403000,
    priceEnd: 8359000,
    priceHigh: 8475000,
    priceLow: 8359000,
    amount: 69,
    volume: 579660000,
    createdAt: 1637808900045,
    _id: '619efb04e74560355faed6ce',
    __v: 0
  },
  {
    code: 'TEST',
    type: 1,
    priceBefore: 0,
    priceStart: 0,
    priceEnd: 0,
    priceHigh: 0,
    priceLow: 0,
    amount: 0,
    volume: 0,
    createdAt: 1637808900045,
    _id: '619efb04e74560355faed6cf',
    __v: 0
  }
] {
*/
