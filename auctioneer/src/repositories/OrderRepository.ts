import { EntityRepository, Repository } from 'typeorm';
import { Order, ORDERTYPE } from '@models/index';

@EntityRepository(Order)
export default class OrderRepository extends Repository<Order> {
	public async readAskOrderByCode(code: string): Promise<Order | undefined> {
		return this.createQueryBuilder('Order')
			.innerJoin('Order.stock', 'Stock')
			.where('Stock.code = :code', { code })
			.andWhere('Order.type = :type', { type: ORDERTYPE.ASK })
			.orderBy('Order.price', 'ASC')
			.addOrderBy('Order.createdAt', 'ASC')
			.setLock('pessimistic_write')
			.getOne();
	}

	public async readBidOrderByCode(code: string): Promise<Order | undefined> {
		return this.createQueryBuilder('Order')
			.innerJoin('Order.stock', 'Stock')
			.where('Stock.code = :code', { code })
			.andWhere('Order.type = :type', { type: ORDERTYPE.BID })
			.orderBy('Order.price', 'ASC')
			.addOrderBy('Order.createdAt', 'ASC')
			.setLock('pessimistic_write')
			.getOne();
	}
}
