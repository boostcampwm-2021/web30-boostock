import { EntityRepository, Repository, InsertResult, UpdateResult, DeleteResult } from 'typeorm';
import User from '@models/User';
import ILockVersion from '@interfaces/ILockVersion';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
	async createUser(user: User): Promise<boolean> {
		const result: InsertResult = await this.insert(user);
		return result.raw.affectedRows > 0;
	}

	async readByIdLock(id: number, lock: ILockVersion): Promise<User> {
		return this.createQueryBuilder().whereInIds(id).setLock(lock).getOneOrFail();
	}

	async updateBalance(userId: number, changeValue: number): Promise<boolean> {
		const { affected } = await this.createQueryBuilder()
			.update()
			.set({ balance: () => `balance + ${changeValue}` })
			.where('userId = :userId', { userId })
			.execute();
		return affected === 1;
	}

	async updateUser(user: User): Promise<boolean> {
		const result: UpdateResult = await this.update(user.userId, user);
		return result.affected != null && result.affected > 0;
	}

	public async deleteUser(id: number): Promise<boolean> {
		const result: DeleteResult = await this.delete(id);
		return result.affected != null && result.affected > 0;
	}

	public async readUserByIdWithStocks(id: number): Promise<User | undefined> {
		return this.findOne(id, { relations: ['stocks'] });
	}

	public async readUserByIdWithFavorites(id: number): Promise<User | undefined> {
		return this.findOne(id, { relations: ['favorites'] });
	}
}
