import { EntityRepository, Repository, InsertResult, UpdateResult, DeleteResult } from 'typeorm';
import Order from '@models/Order';
import { IAskOrder } from '@interfaces/askOrder';
import { IBidOrder } from '@interfaces/bidOrder';

@EntityRepository(Order)
export default class OrderRepository extends Repository<Order> {
	public async readOrderById(id: number): Promise<Order | undefined> {
		return this.findOne(id, {
			lock: { mode: 'pessimistic_write' },
		});
	}

	public async updateOrder(order: Order): Promise<boolean> {
		const result: UpdateResult = await this.update(order.orderId, order);
		return result.affected != null && result.affected > 0;
	}

	public async deleteOrder(id: number): Promise<boolean> {
		const result: DeleteResult = await this.delete(id);
		return result.affected != null && result.affected > 0;
	}

	public async getOrders(stockId: number, type: '1' | '2'): Promise<Array<IAskOrder | IBidOrder>> {
		const LIMIT = 10;

		return this.createQueryBuilder()
			.select(['price', 'SUM(amount) AS amount', 'type'])
			.where('stock_id = :stockId', { stockId })
			.andWhere('status = :status', { status: 'pending' })
			.andWhere('type = :type', { type })
			.groupBy('price')
			.orderBy({ price: 'DESC' })
			.limit(LIMIT)
			.getRawMany<IAskOrder | IBidOrder>();
	}
}
