import { EntityRepository, Repository, InsertResult, UpdateResult } from 'typeorm';
import UserStock from '@models/UserStock';

@EntityRepository(UserStock)
export default class UserStockRepository extends Repository<UserStock> {
	async readUserStockById(userId: number): Promise<UserStock[]> {
		return this.find({ where: { userId }, relations: ['stock'] });
	}

	async createUserStock(userStock: UserStock): Promise<boolean> {
		const result: InsertResult = await this.insert(userStock);
		return result.identifiers.length > 0;
	}

	async updateUserStock(userStock: UserStock): Promise<boolean> {
		const result: UpdateResult = await this.update(userStock.userStockId, userStock);
		return result.affected != null && result.affected > 0;
	}

	async readUserStockLock(userId: number, stockId: number): Promise<UserStock | undefined> {
		return this.findOne({ where: { userId, stockId }, lock: { mode: 'pessimistic_write' } });
	}
}
