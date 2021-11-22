import { EntityRepository, Repository, InsertResult } from 'typeorm';
import UserStock from '@models/UserStock';

@EntityRepository(UserStock)
export default class UserStockRepository extends Repository<UserStock> {
	async createUserStock(userStock: UserStock): Promise<boolean> {
		const result: InsertResult = await this.insert(userStock);
		return result.identifiers.length > 0;
	}

	async readUserStockById(userId: number, stockId: number): Promise<UserStock | undefined> {
		return this.findOne({
			where: {
				userId,
				stockId,
			},
		});
	}
}
