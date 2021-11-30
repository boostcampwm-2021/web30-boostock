import { EntityRepository, Repository, InsertResult, DeleteResult } from 'typeorm';
import Stock from '@models/Stock';

@EntityRepository(Stock)
export default class StockRepository extends Repository<Stock> {
	public async readAllStocks(): Promise<Stock[]> {
		return this.find({
			relations: ['charts'],
		});
	}

	public async readById(id: number): Promise<Stock | undefined> {
		return this.findOne(id);
	}

	public async readByCode(code: string): Promise<Stock> {
		return this.findOneOrFail({ where: { code } });
	}

	public async readBaseInfo(): Promise<{ stock_id: number; code: string }[]> {
		return this.createQueryBuilder().select(['stock_id', 'code']).getRawMany();
	}

	public async deleteStock(id: number): Promise<boolean> {
		const result: DeleteResult = await this.delete(id);
		return result.affected != null && result.affected > 0;
	}

	// Deprecated?
	// public async getCurrentStockPrice(stockId: number): Promise<{ price: number } | undefined> {
	// 	return this.createQueryBuilder().select('price').where('stock_id = :stockId', { stockId }).getRawOne();
	// }

	// Deprecated
	// public async readPriceStocks(): Promise<{ code: string; price: number }[]> {
	// 	const stockPrices = await this.createQueryBuilder().select(['code', 'price']).getRawMany();
	// 	return stockPrices;
	// }
}
