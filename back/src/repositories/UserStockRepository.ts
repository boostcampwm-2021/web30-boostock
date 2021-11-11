import { EntityRepository, Repository, InsertResult, UpdateResult, DeleteResult } from 'typeorm';
import UserStock from '@models/UserStock';

@EntityRepository(UserStock)
export default class UserStockRepository extends Repository<UserStock> {
	async createUserStock(userStock: UserStock): Promise<boolean> {
		const result: InsertResult = await this.insert(userStock);
		return result.identifiers.length > 0;
	}

	async updateUserStock(userStock: UserStock): Promise<boolean> {
		const result: UpdateResult = await this.update(userStock.userStockId, userStock);
		return result.affected != null && result.affected > 0;
	}

	public async deleteUserStock(userId: number, stockId: number): Promise<boolean> {
		const result: DeleteResult = await this.delete({
			userId,
			stockId,
		});
		return result.affected != null && result.affected > 0;
	}
}
