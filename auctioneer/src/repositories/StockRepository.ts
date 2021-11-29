import { EntityRepository, Repository } from 'typeorm';
import Stock from '@models/Stock';

@EntityRepository(Stock)
export default class StockRepository extends Repository<Stock> {
	public async readStockById(id: number): Promise<Stock> {
		return this.findOneOrFail(id);
	}

	public async readStockByCode(code: string): Promise<Stock> {
		return this.findOneOrFail({ where: { code } });
	}

	public async readStockCodeList(): Promise<{ code: string }[]> {
		return this.createQueryBuilder().select(['code']).getRawMany();
	}
}
