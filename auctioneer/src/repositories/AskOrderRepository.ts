import { EntityRepository, Repository } from 'typeorm';
import { AskOrder } from '@models/index';
import { OptimisticVersionError, OptimisticVersionErrorMessage } from '@errors/index';

@EntityRepository(AskOrder)
export default class AskOrderRepository extends Repository<AskOrder> {
	public async readByCode(code: string): Promise<AskOrder> {
		return this.createQueryBuilder('Order')
			.innerJoin('Order.stock', 'Stock')
			.where('Stock.code = :code', { code })
			.orderBy('Order.price', 'ASC')
			.addOrderBy('Order.createdAt', 'ASC')
			.limit(1)
			.getOneOrFail();
	}

	public async removeOrderOCC(order: AskOrder): Promise<void> {
		const { affected } = await this.createQueryBuilder()
			.delete()
			.from(AskOrder)
			.where('order_id = :orderId', { orderId: order.orderId })
			.andWhere('version = :version', { version: order.version })
			.execute();
		if (affected !== 1)
			throw new OptimisticVersionError(OptimisticVersionErrorMessage.OPTIMISTIC_LOCK_VERSION_MISMATCH_ERROR);
	}

	public async decreaseAmountOCC(order: AskOrder, amount: number): Promise<void> {
		const { affected } = await this.createQueryBuilder()
			.update(AskOrder)
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
