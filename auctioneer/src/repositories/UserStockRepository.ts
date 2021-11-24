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
			.leftJoin('UserStock.stock', 'Stock')
			.leftJoin('UserStock.user', 'User')
			.where('User.userId=:userId', { userId })
			.andWhere('Stock.code=:code', { code })
			.setLock('optimistic', 0)
			.getOne();
	}
}
