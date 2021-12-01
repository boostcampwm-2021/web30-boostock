import { EntityRepository, Repository } from 'typeorm';
import { Order, ORDERTYPE, Stock } from '@models/index';
import { OptimisticVersionError, OptimisticVersionErrorMessage } from '@errors/index';

@EntityRepository(Order)
export default class OrderRepository extends Repository<Order> {
	public async readAskOrderByCode(code: string): Promise<Order> {
		// New Version
		// return this.createQueryBuilder('Order')
		// 	.where((qb) => {
		// 		const subQuery = qb
		// 			.subQuery()
		// 			.select('Stock.stockId')
		// 			.from(Stock, 'Stock')
		// 			.where('Stock.code = :code', { code })
		// 			.getQuery();
		// 		return `Order.stockId =  + ${subQuery}`;
		// 	})
		// 	.andWhere('Order.type = :type', { type: ORDERTYPE.ASK })
		// 	.orderBy('Order.price', 'DESC')
		// 	.addOrderBy('Order.createdAt', 'ASC')
		// 	.getOneOrFail();

		// Old Version
		return this.createQueryBuilder('Order')
			.innerJoin('Order.stock', 'Stock')
			.where('Stock.code = :code', { code })
			.andWhere('Order.type = :type', { type: ORDERTYPE.ASK })
			.orderBy('Order.price', 'ASC')
			.addOrderBy('Order.createdAt', 'ASC')
			.getOneOrFail();
	}

	public async readBidOrderByCode(code: string): Promise<Order> {
		// New Version
		// return this.createQueryBuilder('Order')
		// 	.where((qb) => {
		// 		const subQuery = qb
		// 			.subQuery()
		// 			.select('Stock.stockId')
		// 			.from(Stock, 'Stock')
		// 			.where('Stock.code = :code', { code })
		// 			.getQuery();
		// 		return `Order.stockId =  + ${subQuery}`;
		// 	})
		// 	.andWhere('Order.type = :type', { type: ORDERTYPE.BID })
		// 	.orderBy('Order.price', 'DESC')
		// 	.addOrderBy('Order.createdAt', 'ASC')
		// 	.getOneOrFail();

		// Old Version
		return this.createQueryBuilder('Order')
			.innerJoin('Order.stock', 'Stock')
			.where('Stock.code = :code', { code })
			.andWhere('Order.type = :type', { type: ORDERTYPE.BID })
			.orderBy('Order.price', 'DESC')
			.addOrderBy('Order.createdAt', 'ASC')
			.getOneOrFail();
	}

	public async removeOrderOCC(order: Order): Promise<void> {
		const { affected } = await this.createQueryBuilder()
			.delete()
			.from(Order)
			.where('order_id = :orderId', { orderId: order.orderId })
			.andWhere('version = :version', { version: order.version })
			.execute();
		if (affected !== 1)
			throw new OptimisticVersionError(OptimisticVersionErrorMessage.OPTIMISTIC_LOCK_VERSION_MISMATCH_ERROR);
	}

	public async decreaseAmountOCC(order: Order, amount: number): Promise<void> {
		const { affected } = await this.createQueryBuilder()
			.update(Order)
			.set({
				amount: () => `amount - ${amount}`,
				version: order.version + 1,
			})
			.where('order_id = :orderId', { orderId: order.orderId })
			.andWhere('version = :version', { version: order.version })
			.execute();
		if (affected !== 1)
			throw new OptimisticVersionError(OptimisticVersionErrorMessage.OPTIMISTIC_LOCK_VERSION_MISMATCH_ERROR);
	}
}
