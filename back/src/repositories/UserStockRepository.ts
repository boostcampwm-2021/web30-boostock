import { EntityRepository, Repository, InsertResult, UpdateResult } from 'typeorm';
import UserStock from '@models/UserStock';
import ILockVersion from '@interfaces/ILockVersion';

@EntityRepository(UserStock)
export default class UserStockRepository extends Repository<UserStock> {
	async createUserStock(userStock: UserStock): Promise<boolean> {
		const result: InsertResult = await this.insert(userStock);
		return result.identifiers.length > 0;
	}

	async read(userId: number, stockId: number): Promise<UserStock | undefined> {
		return this.createQueryBuilder()
			.where('UserStock.userId = :userId', { userId })
			.andWhere('UserStock.stockId = :stockId', { stockId })
			.getOne();
	}

	async readLock(userStockId: number, lock: ILockVersion): Promise<UserStock> {
		return this.createQueryBuilder()
			.where('UserStock.userStockId = :userStockId', { userStockId })
			.setLock(lock)
			.getOneOrFail();
	}
}
