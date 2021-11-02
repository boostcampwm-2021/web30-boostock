import { EntityRepository, Repository } from 'typeorm';
import Stock from '@models/Stock';

@EntityRepository(Stock)
export default class StockRepository extends Repository<Stock> {
	public async createOrder(stock: Stock): Promise<void> {
		await this.insert(stock);
	}

	public async readOrder(stockId: number): Promise<Stock | undefined> {
		return this.findOne(stockId);
	}

	public async updateOrder(
		stockId: number,
		value: { name?: string },
	): Promise<void> {
		await this.update(stockId, value);
	}

	public async deleteOrder(stockId: number): Promise<void> {
		await this.delete(stockId);
	}
}
