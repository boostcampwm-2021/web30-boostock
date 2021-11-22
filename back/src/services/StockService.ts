/* eslint-disable class-methods-use-this */
import { EntityManager, getCustomRepository, getConnection, createConnection } from 'typeorm';
import { Stock } from '@models/index';
import { StockRepository } from '@repositories/index';
import Transaction, { ITransaction } from '@models/Transaction';
import { CommonError, CommonErrorMessage, ParamError, ParamErrorMessage, StockError, StockErrorMessage } from 'errors/index';

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

	public async getStocksCurrent(): Promise<Stock[]> {
		const stockRepository = getCustomRepository(StockRepository);

		const allStocks: Stock[] = await stockRepository.readAllStocks();
		return allStocks.map((stock) => ({ ...stock, charts: stock.charts.filter(({ type }) => type === 1440) }));
	}

	public async getStocksBaseInfo(): Promise<{ stock_id: number; code: string }[]> {
		const connection = await createConnection();
		const stockRepository = connection.getCustomRepository(StockRepository);
		const baseInfo = await stockRepository.readStockBaseInfo();

		return baseInfo;
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
			await queryRunner.commitTransaction();

			return stock.price;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new StockError(StockErrorMessage.CANNOT_READ_STOCK);
		} finally {
			await queryRunner.release();
		}
	}
}
