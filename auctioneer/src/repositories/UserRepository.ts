import {
	EntityRepository,
	Repository,
	InsertResult,
	UpdateResult,
	DeleteResult,
} from 'typeorm';
import User from '@models/User';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
	async createUser(user: User): Promise<boolean> {
		const result: InsertResult = await this.insert(user);
		return result.raw.length > 0;
	}

	async readUserById(id: number): Promise<User | undefined> {
		return this.findOne(id, {
			lock: { mode: 'pessimistic_write' },
			relations: ['favorites', 'stocks'],
		});
	}

	async updateUser(user: User): Promise<boolean> {
		const result: UpdateResult = await this.update(user.userId, user);
		return result.affected != null && result.affected > 0;
	}

	public async deleteUser(id: number): Promise<boolean> {
		const result: DeleteResult = await this.delete(id);
		return result.affected != null && result.affected > 0;
	}
}
