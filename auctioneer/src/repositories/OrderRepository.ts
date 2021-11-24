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
			.getOneOrFail();
	}

	public async readBidOrderByCode(code: string): Promise<Order | undefined> {
		return this.createQueryBuilder('Order')
			.innerJoin('Order.stock', 'Stock')
			.where('Stock.code = :code', { code })
			.andWhere('Order.type = :type', { type: ORDERTYPE.BID })
			.orderBy('Order.price', 'DESC')
			.addOrderBy('Order.createdAt', 'ASC')
			.getOne();
	}

	public async removeOrder(order: Order): Promise<void> {
		this.createQueryBuilder().delete().from(Order).where('order_id = :orderId', { orderId: order.orderId }).execute();
	}

	public async updateOrder(order: Order, amount: number): Promise<void> {
		this.createQueryBuilder()
			.setLock('optimistic', order.version)
			.update(Order)
			.set({
				amount: () => `amount - ${amount}`,
			})
			.where('order_id = :orderId', { orderId: order.orderId })
			.execute();
	}
}
