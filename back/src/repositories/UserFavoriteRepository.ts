import { EntityRepository, Repository } from 'typeorm';
import UserFavorite from '@models/UserFavorite';

@EntityRepository(UserFavorite)
export default class UserFavoriteRepository extends Repository<UserFavorite> {
	async readUserFavoriteById(userId: number): Promise<UserFavorite[]> {
		return this.find({ where: { userId }, relations: ['stockId'] });
	}
}
