import { EntityRepository, Repository } from 'typeorm';
import Stock from '@models/Stock';
import { DBError, DBErrorMessage } from '@errors/index';

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

	public async deleteStock(id: number): Promise<void> {
		const { affected } = await this.delete(id);
		if (affected !== 1) throw new DBError(DBErrorMessage.DELETE_FAIL);
	}
}
