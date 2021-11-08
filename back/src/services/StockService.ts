import { getCustomRepository, SimpleConsoleLogger } from 'typeorm';
import Stock from '@models/Stock';
import StockRepository from '@repositories/StockRepository';

import Stocks from './StockData.json';

interface IStock {
	stockCode: string;
	name: string;
	highPrice: number;
	currentPrice: number;
	lowPrice: number;
	previousClosingPrice: number;
	tradingVolume: number;
	tradingAmount: number;
}

export default class StockService {
	static instance: StockService | null = null;

	protected stockRepository: StockRepository | null =
		getCustomRepository(StockRepository);

	constructor() {
		if (StockService.instance) return StockService.instance;
		StockService.instance = this;
	}

	getStocksCurrent = (): IStock[] => {
		return Stocks.stockData;
	};
}
