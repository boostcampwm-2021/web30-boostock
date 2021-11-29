import { EntityRepository, Repository, InsertResult } from 'typeorm';
import User from '@models/User';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
	async createUser(user: User): Promise<boolean> {
		const result: InsertResult = await this.insert(user);
		return result.raw.length > 0;
	}

	async readByIdLock(UserId: number): Promise<User[]> {
		return this.createQueryBuilder('User')
			.where('User.userId = :askUserId', { UserId })
			.setLock('pessimistic_read')
			.getMany();
	}

	async readAskBidByIdLock(askUserId: number, bidUserId: number): Promise<User[]> {
		return this.createQueryBuilder('User')
			.where('User.userId = :askUserId', { askUserId })
			.orWhere('User.userId = :bidUserId', { bidUserId })
			.setLock('pessimistic_read')
			.getMany();
	}
}
