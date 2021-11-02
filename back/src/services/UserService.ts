import { getCustomRepository } from 'typeorm';
import User from '@models/User';
import UserRepository from '@repositories/UserRepository';

export default class UserService {
	static instance: UserService | null = null;

	protected userRepository: UserRepository | null = getCustomRepository(
		UserRepository,
		'mysql',
	);

	constructor() {
		if (UserService.instance) return UserService.instance;
		UserService.instance = this;
	}

	public async signUp(user: User): Promise<void> {
		if (!this.userRepository) return;
		await this.userRepository.createUser(user);
	}

	public async getLoggedUser(): Promise<User | null> {
		if (!this.userRepository) return null;
		const id = 1;
		const userEntity = await this.userRepository.getUserById(id);
		return userEntity;
	}
}
