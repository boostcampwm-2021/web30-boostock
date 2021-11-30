import { EntityRepository, Repository } from 'typeorm';
import Stock from '@models/Stock';

@EntityRepository(Stock)
export default class StockRepository extends Repository<Stock> {
	public async readStockCodeList(): Promise<{ code: string }[]> {
		return this.createQueryBuilder().select(['code']).getRawMany();
	}
}
