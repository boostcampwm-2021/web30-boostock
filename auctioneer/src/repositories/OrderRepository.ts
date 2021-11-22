import { EntityRepository, Repository, MoreThan } from 'typeorm';
import { Order } from '@models/index';

@EntityRepository(Order)
export default class OrderRepository extends Repository<Order> {
	public async readOrderByAsc(stockId: number, type: number): Promise<Order | undefined> {
		return this.findOne({
			where: {
				stockId,
				type,
				amount: MoreThan(0),
			},
			order: { price: 'ASC', createdAt: 'ASC' },
			lock: { mode: 'pessimistic_write' },
		});
	}

	public async readOrderByDesc(stockId: number, type: number): Promise<Order | undefined> {
		return this.findOne({
			where: {
				stockId,
				type,
				amount: MoreThan(0),
			},
			order: { price: 'DESC', createdAt: 'ASC' },
			lock: { mode: 'pessimistic_write' },
		});
	}
}
