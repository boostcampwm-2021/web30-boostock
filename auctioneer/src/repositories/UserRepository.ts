import { EntityRepository, Repository, InsertResult } from 'typeorm';
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
		});
	}
}
