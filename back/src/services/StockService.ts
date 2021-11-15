/* eslint-disable class-methods-use-this */
import { EntityManager, createQueryBuilder } from 'typeorm';
import { Stock } from '@models/index';
import { StockRepository } from '@repositories/index';
import { CommonError, CommonErrorMessage, StockError, StockErrorMessage } from '@services/errors/index';

export default class StockService {
	static instance: StockService | null = null;

	private getStockRepository(entityManager: EntityManager): StockRepository {
		const stockRepository: StockRepository | null = entityManager.getCustomRepository(StockRepository);

		if (!entityManager || !stockRepository) throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return stockRepository;
	}

	constructor() {
		if (StockService.instance) return StockService.instance;
		StockService.instance = this;
	}

	public async getStockById(entityManager: EntityManager, id: number): Promise<Stock> {
		const stockRepository: StockRepository = this.getStockRepository(entityManager);

		const stock = await stockRepository.readStockById(id);
		if (!stock) throw new StockError(StockErrorMessage.NOT_EXIST_STOCK);
		return stock;
	}

	public async getStockByCode(entityManager: EntityManager, code: string): Promise<Stock> {
		const stockRepository: StockRepository = this.getStockRepository(entityManager);

		const stock = await stockRepository.readStockByCode(code);
		if (!stock) throw new StockError(StockErrorMessage.NOT_EXIST_STOCK);
		return stock;
	}

	public async getStocksCurrent(entityManager: EntityManager): Promise<Stock[]> {
		const stockRepository: StockRepository = this.getStockRepository(entityManager);

		const allStocks: Stock[] = await stockRepository.readAllStocks();
		return allStocks.map((stock) => ({ ...stock, charts: stock.charts.filter(({ type }) => type === 1440) }));
	}
}
