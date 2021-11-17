/* eslint-disable class-methods-use-this */
import { EntityManager, getConnection, createQueryBuilder } from 'typeorm';
import { Stock } from '@models/index';
import { StockRepository } from '@repositories/index';
import { CommonError, CommonErrorMessage, StockError, StockErrorMessage } from '@services/errors/index';
import Transaction, { ITransaction } from '@models/Transaction';

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

	public async getCurrentStockPrice(entityManager: EntityManager, stockId: number): Promise<{ price: number }> {
		const stockRepository: StockRepository = this.getStockRepository(entityManager);

		const stockPrice = await stockRepository.getCurrentStockPrice(stockId);
		if (!stockPrice) throw new StockError(StockErrorMessage.NOT_EXIST_STOCK);
		return stockPrice;
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

	public async getConclusionByCode(code: string): Promise<ITransaction[]> {
		const conclusionsData = await Transaction.find({ stockCode: code }, { amount: 1, price: 1, createdAt: 1, _id: 1 })
			.sort({ createdAt: -1 })
			.limit(50);

		return conclusionsData;
	}

	public async getCurrentPriceByCode(code: string): Promise<number> {
		const connection = getConnection();
		const queryRunner = connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const stockRepository: StockRepository = this.getStockRepository(queryRunner.manager);
			const stock = await stockRepository.readStockByCode(code);
			if (!stock) throw new StockError(StockErrorMessage.NOT_EXIST_STOCK);
			queryRunner.commitTransaction();

			return stock.price;
		} catch (error) {
			queryRunner.rollbackTransaction();
			throw new StockError(StockErrorMessage.CANNOT_READ_STOCK);
		} finally {
			queryRunner.release();
		}
	}
}
