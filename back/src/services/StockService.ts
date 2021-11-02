import { getCustomRepository } from 'typeorm';
import Stock from '@models/Stock';
import StockRepository from '@repositories/StockRepository';

export default class StockService {
	static instance: StockService | null = null;

	protected stockRepository: StockRepository | null =
		getCustomRepository(StockRepository);

	constructor() {
		if (StockService.instance) return StockService.instance;
		StockService.instance = this;
	}
}
