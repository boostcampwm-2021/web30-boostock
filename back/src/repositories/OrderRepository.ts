import { EntityRepository, Repository, UpdateResult, DeleteResult } from 'typeorm';
import Order, { ORDERTYPE } from '@models/Order';
import { IOrder } from '@interfaces/IOrder';
import { OptimisticVersionError, OptimisticVersionErrorMessage } from '@errors/index';

@EntityRepository(Order)
export default class OrderRepository extends Repository<Order> {
	public async insertNewOrder(value) {
		return this.createQueryBuilder().insert().into(Order).values(value).execute();
	}

	public async readById(id: number): Promise<Order> {
		return this.findOneOrFail(id);
	}

	public async readSummary(stockId: number, type: ORDERTYPE): Promise<IOrder[]> {
		const LIMIT = 10;
		const orderPredicate = type === ORDERTYPE.ASK ? 'ASC' : 'DESC';

		const result = await this.createQueryBuilder()
			.select(['price', 'SUM(amount) AS amount', 'type'])
			.where('stock_id = :stockId', { stockId })
			.andWhere('type = :type', { type })
			.groupBy('price')
			.orderBy({ price: orderPredicate })
			.limit(LIMIT)
			.getRawMany<IOrder>();

		return type === ORDERTYPE.ASK ? result.reverse() : result;
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
