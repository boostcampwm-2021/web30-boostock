import { EntityRepository, Repository } from 'typeorm';
import Order from '@models/Order';

@EntityRepository(Order)
export default class StockRepository extends Repository<Order> {
	public async createOrder(order: Order): Promise<void> {
		await this.insert(order);
	}

	public async readOrder(orderId: number): Promise<Order | undefined> {
		return this.findOne(orderId);
	}

	public async updateOrder(
		orderId: number,
		data: { amount?: number; price?: number },
	): Promise<void> {
		await this.update(orderId, data);
	}

	public async deleteOrder(orderId: number): Promise<void> {
		await this.delete(orderId);
	}

	/* TODO: FIND METHOD
	public async readOrdersByFilter(
		filter: {
			user_id?: number;
			stock_id?: number;
			type?: number;
			amount?: number;
			price?: number;
		},
		skip: {
			offset?: number;
			limit?: number;
		},
	): Promise<Order[]> {
		return this.find(filter);
	}
    */
}
