import { EntityRepository, Repository } from 'typeorm';
import { BidOrder } from '@models/index';
import { OptimisticVersionError, OptimisticVersionErrorMessage } from '@errors/index';

@EntityRepository(BidOrder)
export default class BidOrderRepository extends Repository<BidOrder> {
	public async readByCode(code: string): Promise<BidOrder> {
		return this.createQueryBuilder('Order')
			.innerJoin('Order.stock', 'Stock')
			.where('Stock.code = :code', { code })
			.orderBy('Order.price', 'DESC')
			.addOrderBy('Order.createdAt', 'ASC')
			.limit(1)
			.getOneOrFail();
	}

	public async removeOrderOCC(order: BidOrder): Promise<void> {
		const { affected } = await this.createQueryBuilder()
			.delete()
			.from(BidOrder)
			.where('order_id = :orderId', { orderId: order.orderId })
			.andWhere('version = :version', { version: order.version })
			.execute();
		if (affected !== 1)
			throw new OptimisticVersionError(OptimisticVersionErrorMessage.OPTIMISTIC_LOCK_VERSION_MISMATCH_ERROR);
	}

	public async decreaseAmountOCC(order: BidOrder, amount: number): Promise<void> {
		const { affected } = await this.createQueryBuilder()
			.update(BidOrder)
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
