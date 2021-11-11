import { EntityRepository, Repository, InsertResult, UpdateResult, DeleteResult } from 'typeorm';
import UserFavorite from '@models/UserFavorite';

@EntityRepository(UserFavorite)
export default class UserFavoriteRepository extends Repository<UserFavorite> {
	async createUserFavorite(userFavorite: UserFavorite): Promise<boolean> {
		const result: InsertResult = await this.insert(userFavorite);
		return result.identifiers.length > 0;
	}

	async updateUserFavorite(userFavorite: UserFavorite): Promise<boolean> {
		const result: UpdateResult = await this.update(userFavorite.userFavoriteId, userFavorite);
		return result.affected != null && result.affected > 0;
	}

	public async deleteUserFavorite(userId: number, stockId: number): Promise<boolean> {
		const result: DeleteResult = await this.delete({
			userId,
			stockId,
		});
		return result.affected != null && result.affected > 0;
	}
}
