import { EntityRepository, Repository, InsertResult } from 'typeorm';
import UserStock from '@models/UserStock';
import ILockVersion from '@interfaces/ILockVersion';

@EntityRepository(UserStock)
export default class UserStockRepository extends Repository<UserStock> {
	async createUserStock(userStock: UserStock): Promise<boolean> {
		const result: InsertResult = await this.insert(userStock);
		return result.identifiers.length > 0;
	}

	async read(userId: number, stockId: number): Promise<UserStock | undefined> {
		return this.createQueryBuilder('UserStock')
			.where('UserStock.userId = :userId', { userId })
			.andWhere('UserStock.stockId = :stockId', { stockId })
			.getOne();
	}

	async readLock(userStockId: number, lock: ILockVersion): Promise<UserStock> {
		return this.createQueryBuilder('UserStock')
			.where('UserStock.userId = :userStockId', { userStockId })
			.setLock(lock)
			.getOneOrFail();
	}

	// async updateAmountAverage(userStockId: number, changeValue: number): Promise<boolean> {
	// 	const { affected } = await this.createQueryBuilder()
	// 		.update()
	// 		.set({ amount: () => `amount += ${changeValue}` })
	// 		.whereInIds(userStockId)
	// 		.execute();
	// 	return affected === 1;
	// }
}
