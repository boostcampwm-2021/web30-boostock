/* eslint-disable class-methods-use-this */
import { EntityManager } from 'typeorm';
import { Stock } from '@models/index';
import { StockRepository } from '@repositories/index';
import {
	CommonError,
	CommonErrorMessage,
	StockError,
	StockErrorMessage,
} from '@services/errors/index';

import Stocks from './StockData.json';

interface IStock {
	id: number;
	code: string;
	korean: string;
	english: string;
	highPrice: number;
	currentPrice: number;
	lowPrice: number;
	previousClosingPrice: number;
	tradingVolume: number;
	tradingAmount: number;
}

export default class StockService {
	static instance: StockService | null = null;

	private getStockRepository(entityManager: EntityManager): StockRepository {
		const stockRepository: StockRepository | null =
			entityManager.getCustomRepository(StockRepository);

		if (!entityManager || !stockRepository)
			throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return stockRepository;
	}

	constructor() {
		if (StockService.instance) return StockService.instance;
		StockService.instance = this;
	}

	public async getStockById(
		entityManager: EntityManager,
		id: number,
	): Promise<Stock> {
		if (!Number.isInteger(id))
			throw new CommonError(CommonErrorMessage.INVALID_REQUEST);

		const stockRepository: StockRepository =
			this.getStockRepository(entityManager);

		const stockEntity = await stockRepository.readStockById(id);
		if (!stockEntity)
			throw new StockError(StockErrorMessage.NOT_EXIST_STOCK);
		return stockEntity;
	}

	public async getStockByCode(
		entityManager: EntityManager,
		code: string,
	): Promise<Stock> {
		if (typeof code !== 'string')
			throw new CommonError(CommonErrorMessage.INVALID_REQUEST);

		const stockRepository: StockRepository =
			this.getStockRepository(entityManager);

		const stockEntity = await stockRepository.readStockByCode(code);
		if (!stockEntity)
			throw new StockError(StockErrorMessage.NOT_EXIST_STOCK);
		return stockEntity;
	}

	getStocksCurrent = (): IStock[] => {
		const { stockData } = Stocks;

		return [
			{
				...stockData[0],
				currentPrice: Math.floor(Math.random() * 100000),
				highPrice: Math.floor(Math.random() * 100000),
				lowPrice: Math.floor(Math.random() * 100000),
				previousClosingPrice: Math.floor(Math.random() * 100000),
				tradingVolume: Math.floor(Math.random() * 10000000000),
				tradingAmount: Math.floor(Math.random() * 10000000000),
			},
			{
				...stockData[1],
				currentPrice: Math.floor(Math.random() * 100000),
				highPrice: Math.floor(Math.random() * 100000),
				lowPrice: Math.floor(Math.random() * 100000),
				previousClosingPrice: Math.floor(Math.random() * 100000),
				tradingVolume: Math.floor(Math.random() * 10000000000),
				tradingAmount: Math.floor(Math.random() * 10000000000),
			},
			{
				...stockData[2],
				currentPrice: Math.floor(Math.random() * 100000),
				highPrice: Math.floor(Math.random() * 100000),
				lowPrice: Math.floor(Math.random() * 100000),
				previousClosingPrice: Math.floor(Math.random() * 100000),
				tradingVolume: Math.floor(Math.random() * 10000000000),
				tradingAmount: Math.floor(Math.random() * 10000000000),
			},
			{
				...stockData[3],
				currentPrice: Math.floor(Math.random() * 100000),
				highPrice: Math.floor(Math.random() * 100000),
				lowPrice: Math.floor(Math.random() * 100000),
				previousClosingPrice: Math.floor(Math.random() * 100000),
				tradingVolume: Math.floor(Math.random() * 10000000000),
				tradingAmount: Math.floor(Math.random() * 10000000000),
			},
		];
	};
}
