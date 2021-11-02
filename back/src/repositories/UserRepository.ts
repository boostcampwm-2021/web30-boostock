import { EntityRepository, Repository } from 'typeorm';
import User from '@models/User';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
	async createUser(user: User): Promise<void> {
		await this.save(user);
	}

	async getUserById(id: number): Promise<User | null> {
		const user = await this.findOne(id);
		return user || null;
	}
}
