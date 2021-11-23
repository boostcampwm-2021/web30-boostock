import { EntityRepository, Repository } from 'typeorm';
import Stock from '@models/Stock';

@EntityRepository(Stock)
export default class StockRepository extends Repository<Stock> {
	public async readStockById(id: number): Promise<Stock | undefined> {
		return this.findOne(id, {
			// lock: { mode: 'pessimistic_write' },
		});
	}

	public async readStockByCode(code: string): Promise<Stock | undefined> {
		return this.findOne({
			where: { code },
			// lock: { mode: 'pessimistic_write' },
		});
	}
}
