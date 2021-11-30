import { EntityRepository, Repository, InsertResult } from 'typeorm';
import User from '@models/User';
import ILockVersion from '@interfaces/ILockVersion';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
	async createUser(user: User): Promise<boolean> {
		const result: InsertResult = await this.insert(user);
		return result.raw.length > 0;
	}

	async readByIdLock(userId: number, lock: ILockVersion): Promise<User> {
		return this.createQueryBuilder('User').where('User.userId = :userId', { userId }).setLock(lock).getOneOrFail();
	}

	async readAskBidByIdLock(askUserId: number, bidUserId: number, lock: ILockVersion): Promise<User[]> {
		return this.createQueryBuilder('User')
			.where('User.userId = :askUserId', { askUserId })
			.orWhere('User.userId = :bidUserId', { bidUserId })
			.setLock(lock)
			.getMany();
	}

	async updateBalance(userId: number, changeValue: number): Promise<boolean> {
		const { affected } = await this.createQueryBuilder()
			.update()
			.set({ balance: () => `balance + ${changeValue}` })
			.where('userId = :userId', { userId })
			.execute();
		return affected === 1;
	}
}
