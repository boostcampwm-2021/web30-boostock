import { EntityRepository, Repository, InsertResult, DeleteResult } from 'typeorm';
import Stock from '@models/Stock';

@EntityRepository(Stock)
export default class StockRepository extends Repository<Stock> {
	public async createStock(stock: Stock): Promise<boolean> {
		const result: InsertResult = await this.insert(stock);
		return result.identifiers.length > 0;
	}

	public async readAllStocks(): Promise<Stock[] | undefined> {
		return this.find({
			lock: { mode: 'pessimistic_write' },
		});
	}

	public async readStockById(id: number): Promise<Stock | undefined> {
		return this.findOne(id, {
			lock: { mode: 'pessimistic_write' },
		});
	}

	public async readStockByCode(code: string): Promise<Stock | undefined> {
		return this.findOne({
			where: { code },
			lock: { mode: 'pessimistic_write' },
		});
	}

	public async deleteStock(id: number): Promise<boolean> {
		const result: DeleteResult = await this.delete(id);
		return result.affected != null && result.affected > 0;
	}
}
