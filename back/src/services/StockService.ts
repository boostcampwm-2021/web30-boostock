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

	public async getStocksCurrent(
		entityManager: EntityManager,
	): Promise<Stock[]> {
		const stockRepository: StockRepository =
			this.getStockRepository(entityManager);

		const allStocks = await stockRepository.readAllStocks();
		if (!allStocks) throw new StockError(StockErrorMessage.NOT_EXIST_STOCK);

		return allStocks;
	}
}
