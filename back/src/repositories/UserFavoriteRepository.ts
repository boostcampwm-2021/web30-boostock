import { EntityRepository, Repository } from 'typeorm';
import UserFavorite from '@models/UserFavorite';
import { Stock } from '@models/index';

@EntityRepository(UserFavorite)
export default class UserFavoriteRepository extends Repository<UserFavorite> {
	async readByUserId(userId: number): Promise<UserFavorite[]> {
		return this.find({ where: { userId }, relations: ['stockId'] });
	}

	async deleteByUserIdStock(userId: number, stock: Stock) {
		return this.createQueryBuilder()
			.delete()
			.from(UserFavorite)
			.where('userId = :userId', { userId })
			.andWhere('stockId = :stockId', { stockId: stock.stockId })
			.execute();
	}
}
