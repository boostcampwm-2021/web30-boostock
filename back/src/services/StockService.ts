/* eslint-disable class-methods-use-this */
import { EntityManager, getCustomRepository, getConnection } from 'typeorm';
import { Stock, ChartLog, TransactionLog, ITransactionLog } from '@models/index';
import { StockRepository } from '@repositories/index';
import { CommonError, CommonErrorMessage, StockError, StockErrorMessage } from '@errors/index';
import IChartLog, { CHARTTYPE_VALUE } from '@interfaces/IChartLog';

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

	public async getStocksCurrent(): Promise<Stock[]> {
		const stockRepository = getCustomRepository(StockRepository);

		const allStocks: Stock[] = await stockRepository.readAllStocks();
		return allStocks;
	}

	static async getStockLog(code: string, type: CHARTTYPE_VALUE, start: number, end: number): Promise<IChartLog[]> {
		const document = await ChartLog.find()
			.select('-_id -type -__v')
			.where('code', code)
			.where('type', type)
			.gte('createdAt', start)
			.lt('createdAt', end)
			.sort('createdAt');
		return document || [];
	}

	public async getStocksBaseInfo(): Promise<{ stock_id: number; code: string }[]> {
		const connection = await getConnection();
		const stockRepository = connection.getCustomRepository(StockRepository);
		const baseInfo = await stockRepository.readStockBaseInfo();

		return baseInfo;
	}

	public async getConclusionByCode(code: string): Promise<ITransactionLog[]> {
		const conclusionsData = await TransactionLog.find(
			{ stockCode: code },
			{ amount: 1, price: 1, createdAt: 1, _id: 1, stockCode: 1 },
		)
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

	public async getPriceStockAll(): Promise<{ code: string; price: number }[]> {
		const connection = await getConnection();
		const stockRepository = connection.getCustomRepository(StockRepository);
		const stockPrices = await stockRepository.readPriceStocks();
		return stockPrices;
	}

	public async getDailyLogs(code: string): Promise<IChartLog[]> {
		const dailyLogs = await ChartLog.find({ code, type: 1440 }, { _id: 1, code: 1, priceEnd: 1, amount: 1, createdAt: 1 })
			.sort({ createdAt: -1 })
			.limit(51);

		return dailyLogs;
	}
}
