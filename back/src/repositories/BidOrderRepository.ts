import { EntityRepository, Repository } from 'typeorm';
import BidOrder, { ORDERTYPE } from '@models/AskOrder';
import { IOrder } from '@interfaces/IOrder';
import { DBError, DBErrorMessage, OptimisticVersionError, OptimisticVersionErrorMessage } from '@errors/index';

@EntityRepository(BidOrder)
export default class BidOrderRepository extends Repository<BidOrder> {
	public async insertQueryRunner(value): Promise<void> {
		const { identifiers } = await this.createQueryBuilder().insert().into(BidOrder).values(value).execute();
		if (identifiers.length !== 1) throw new DBError(DBErrorMessage.INSERT_FAIL);
	}

	public async readById(id: number): Promise<BidOrder> {
		return this.findOneOrFail(id);
	}

	public async readSummary(stockId: number): Promise<IOrder[]> {
		const LIMIT = 10;

		const result = await this.createQueryBuilder()
			.select(['price', 'SUM(amount) AS amount'])
			.where('stock_id = :stockId', { stockId })
			.groupBy('price')
			.orderBy({ price: 'DESC' })
			.limit(LIMIT)
			.getRawMany<IOrder>();

		return result;
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
