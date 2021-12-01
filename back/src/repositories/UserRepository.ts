import { EntityRepository, Repository, InsertResult, UpdateResult, DeleteResult } from 'typeorm';
import User from '@models/User';
import ILockVersion from '@interfaces/ILockVersion';
import DBError, { DBErrorMessage } from '@errors/DBError';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
	async createUser(user: User): Promise<boolean> {
		const { identifiers } = await this.insert(user);
		return identifiers.length === 1;
	}

	async readByIdLock(id: number, lock: ILockVersion): Promise<User> {
		return this.createQueryBuilder().whereInIds(id).setLock(lock).getOneOrFail();
	}

	async updateBalance(userId: number, changeValue: number): Promise<void> {
		const { affected } = await this.createQueryBuilder()
			.update()
			.set({ balance: () => `balance + ${changeValue}` })
			.where('userId = :userId', { userId })
			.execute();
		if (affected !== 1) throw new DBError(DBErrorMessage.UPDATE_FAIL);
	}

	// UNUSED
	async updateUser(user: User): Promise<boolean> {
		const { affected } = await this.update(user.userId, user);
		return affected === 1;
	}

	// UNUSED
	public async deleteUser(id: number): Promise<boolean> {
		const { affected } = await this.delete(id);
		return affected === 1;
	}

	public async readUserByIdWithStocks(id: number): Promise<User | undefined> {
		return this.findOne(id, { relations: ['stocks'] });
	}

	public async readUserByIdWithFavorites(id: number): Promise<User | undefined> {
		return this.findOne(id, { relations: ['favorites'] });
	}
}
