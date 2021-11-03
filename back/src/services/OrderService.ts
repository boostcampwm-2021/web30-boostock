import { getCustomRepository } from 'typeorm';
import Order, { OrderStatus } from '@models/Order';
import OrderRepository from '@repositories/OrderRepository';

export default class OrderService {
	static instance: OrderService | null = null;

	protected orderRepository: OrderRepository | null =
		getCustomRepository(OrderRepository);

	constructor() {
		if (OrderService.instance) return OrderService.instance;
		OrderService.instance = this;
	}

	/* TODO: SEARCH METHOD
	public async search(data: {
		userId?: number;
		stockId?: number;
		type?: number;
		amount?: number;
		price?: number;
		offset?: number;
		limit?: number;
	}): Promise<Order[]> {
		if (!this.orderRepository) return [];
		console.log(data);
		await this.orderRepository.readOrdersByFilter(
			{
				user_id: data.userId,
				stock_id: data.stockId,
				type: data.type,
				amount: data.amount,
				price: data.price,
			},
			{
				offset: data.offset,
				limit: data.limit,
			},
		);
		return [];
	}
    */

	public async order(data: {
		userId: number;
		stockId: number;
		type: number;
		option: number;
		amount: number;
		price: number;
	}): Promise<void> {
		if (!this.orderRepository) return;
		const orderEntity = new Order();
		orderEntity.user_id = data.userId;
		orderEntity.stock_id = data.stockId;
		orderEntity.type = data.type;
		orderEntity.amount = data.amount;
		orderEntity.price = data.price;
		orderEntity.created_at = new Date();
		orderEntity.status = OrderStatus.PENDING;
		await this.orderRepository.createOrder(orderEntity);
	}

	public async cancel(orderId: number): Promise<void> {
		if (!this.orderRepository) return;
		await this.orderRepository.deleteOrder(orderId);
	}

	public async modify(
		orderId: number,
		data: { amount?: number; price?: number },
	): Promise<void> {
		if (!this.orderRepository) return;
		if (data.amount && data.price)
			await this.orderRepository.updateOrder(orderId, data);
		else if (data.amount)
			await this.orderRepository.updateOrder(orderId, {
				amount: data.amount,
			});
		else if (data.price)
			await this.orderRepository.updateOrder(orderId, {
				price: data.price,
			});
	}
}
