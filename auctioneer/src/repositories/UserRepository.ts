import { EntityRepository, Repository } from 'typeorm';
import User from '@models/User';
import ILockVersion from '@interfaces/ILockVersion';
import { DBError, DBErrorMessage } from '@errors/index';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
	async createUser(user: User): Promise<void> {
		const { identifiers } = await this.insert(user);
		if (identifiers.length !== 1) throw new DBError(DBErrorMessage.INSERT_FAIL);
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

	async updateBalance(userId: number, changeValue: number): Promise<void> {
		const { affected } = await this.createQueryBuilder()
			.update()
			.set({ balance: () => `balance + ${changeValue}` })
			.where('userId = :userId', { userId })
			.execute();
		if (affected !== 1) throw new DBError(DBErrorMessage.UPDATE_FAIL);
	}
}
