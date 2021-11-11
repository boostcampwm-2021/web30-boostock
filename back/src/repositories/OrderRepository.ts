import { EntityRepository, Repository, InsertResult, UpdateResult, DeleteResult } from 'typeorm';
import Order from '@models/Order';

@EntityRepository(Order)
export default class OrderRepository extends Repository<Order> {
	public async createOrder(order: Order): Promise<boolean> {
		const result: InsertResult = await this.insert(order);
		return result.identifiers.length > 0;
	}

	public async readOrderById(id: number): Promise<Order | undefined> {
		return this.findOne(id, {
			lock: { mode: 'pessimistic_write' },
			relations: ['userId', 'stockId'],
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
}
