import { EntityRepository, Repository, InsertResult } from 'typeorm';
import UserStock from '@models/UserStock';

@EntityRepository(UserStock)
export default class UserStockRepository extends Repository<UserStock> {
	async createUserStock(userStock: UserStock): Promise<boolean> {
		const result: InsertResult = await this.insert(userStock);
		return result.identifiers.length > 0;
	}

	async readUserStockByCode(userId: number, code: string): Promise<UserStock | undefined> {
		return this.createQueryBuilder('UserStock')
			.leftJoin('UserStock.stock', 'Stock', 'Stock.code = :code', { code })
			.leftJoin('UserStock.user', 'User', 'User.userId = :userId', { userId })
			.setLock('pessimistic_write')
			.getOne();
	}
}
