/* eslint-disable class-methods-use-this */
import { EntityManager } from 'typeorm';
import { User } from '@models/index';
import { UserRepository } from '@repositories/index';
import { CommonError, CommonErrorMessage, UserError, UserErrorMessage } from '@services/errors/index';

export default class UserService {
	static instance: UserService | null = null;

	constructor() {
		if (UserService.instance) return UserService.instance;
		UserService.instance = this;
	}

	private getUserRepository(entityManager: EntityManager): UserRepository {
		const userRepository: UserRepository | null = entityManager.getCustomRepository(UserRepository);

		if (!entityManager || !userRepository) throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return userRepository;
	}

	public async signUp(
		entityManager: EntityManager,
		userData: {
			username: string;
			email: string;
			socialGithub: string;
		},
	): Promise<void> {
		const userRepository: UserRepository = this.getUserRepository(entityManager);

		userRepository.createUser(
			userRepository.create({
				...userData,
				balance: 0,
			}),
		);
	}

	public async getUserById(entityManager: EntityManager, id: number): Promise<User> {
		const userRepository: UserRepository = this.getUserRepository(entityManager);

		const user = await userRepository.readUserById(id);
		if (!user) throw new UserError(UserErrorMessage.NOT_EXIST_USER);
		return user;
	}

	public async setBalance(entityManager: EntityManager, id: number, balance: number): Promise<void> {
		const userRepository: UserRepository = this.getUserRepository(entityManager);

		await userRepository.updateUser(
			userRepository.create({
				userId: id,
				balance,
			}),
		);
	}

	public async deleteUser(entityManager: EntityManager, id: number): Promise<void> {
		const userRepository: UserRepository = this.getUserRepository(entityManager);
		await userRepository.deleteUser(id);
	}
}
