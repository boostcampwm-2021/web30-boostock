import { EntityRepository, Repository, InsertResult, UpdateResult, DeleteResult, MoreThan } from 'typeorm';
import Order, { OrderStatus } from '@models/Order';

@EntityRepository(Order)
export default class OrderRepository extends Repository<Order> {
	public async createOrder(order: Order): Promise<boolean> {
		const result: InsertResult = await this.insert(order);
		return result.identifiers.length > 0;
	}

	public async readOrderById(id: number): Promise<Order | undefined> {
		return this.findOne(id, {
			lock: { mode: 'pessimistic_write' },
		});
	}

	public async readOrderByAsc(stockId: number, type: number): Promise<Order | undefined> {
		return this.findOne({
			where: {
				stockId,
				type,
				amount: MoreThan(0),
				status: OrderStatus.PENDING,
			},
			order: { price: 'ASC', createdAt: 'DESC' },
			lock: { mode: 'pessimistic_write' },
		});
	}

	public async readOrderByDesc(stockId: number, type: number): Promise<Order | undefined> {
		return this.findOne({
			where: {
				stockId,
				type,
				amount: MoreThan(0),
				status: OrderStatus.PENDING,
			},
			order: { price: 'DESC', createdAt: 'DESC' },
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
}
