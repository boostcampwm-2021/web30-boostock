import { EntityRepository, Repository, InsertResult } from 'typeorm';
import UserStock from '@models/UserStock';

@EntityRepository(UserStock)
export default class UserStockRepository extends Repository<UserStock> {
	async createUserStock(userStock: UserStock): Promise<boolean> {
		const result: InsertResult = await this.insert(userStock);
		return result.identifiers.length > 0;
	}

	async readLock(userId: number, stockId: number): Promise<UserStock | undefined> {
		return this.createQueryBuilder('UserStock')
			.where('UserStock.userId = :userId', { userId })
			.andWhere('UserStock.stockId = :stockId', { stockId })
			.setLock('pessimistic_read')
			.getOne();
	}
}
