/* eslint-disable class-methods-use-this */
import { EntityManager, createQueryBuilder, getCustomRepository } from 'typeorm';
import { Stock } from '@models/index';
import { StockRepository } from '@repositories/index';
import {
	CommonError,
	CommonErrorMessage,
	ParamError,
	ParamErrorMessage,
	StockError,
	StockErrorMessage,
} from '@services/errors/index';

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

	static async getStockCodeById(id: number): Promise<string> {
		if (id === undefined) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
		const stockRepository: StockRepository = getCustomRepository(StockRepository);
		const stock = await stockRepository.findOne(id);
		if (stock === undefined) throw new StockError(StockErrorMessage.NOT_EXIST_STOCK);
		return stock.code;
	}

	static async getStockIdByCode(code: string): Promise<number> {
		if (code === undefined) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
		const stockRepository: StockRepository = getCustomRepository(StockRepository);
		const stock = await stockRepository.findOne({ where: { code } });
		if (stock === undefined) throw new StockError(StockErrorMessage.NOT_EXIST_STOCK);
		return stock.stockId;
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
