import { EntityRepository, Repository, InsertResult, DeleteResult } from 'typeorm';
import Stock from '@models/Stock';

@EntityRepository(Stock)
export default class StockRepository extends Repository<Stock> {
	public async createStock(stock: Stock): Promise<boolean> {
		const result: InsertResult = await this.insert(stock);
		return result.identifiers.length > 0;
	}

	public async readAllStocks(): Promise<Stock[]> {
		return this.find({
			relations: ['charts'],
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

	public async getCurrentStockPrice(stockId: number): Promise<{ price: number } | undefined> {
		return this.createQueryBuilder().select('price').where('stock_id = :stockId', { stockId }).getRawOne();
	}

	public async readStockBaseInfo(): Promise<{ stock_id: number; code: string }[]> {
		const baseInfo = await this.createQueryBuilder().select(['stock_id', 'code']).getRawMany();
		return baseInfo;
		// return this.createQueryBuilder().select('price').where('stock_id = :stockId', { stockId }).getRawOne();
	}
}
