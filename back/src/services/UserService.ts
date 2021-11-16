/* eslint-disable class-methods-use-this */
import { EntityManager, getCustomRepository } from 'typeorm';
import { User } from '@models/index';
import { UserRepository } from '@repositories/index';
import { CommonError, CommonErrorMessage, UserError, UserErrorMessage } from '@services/errors/index';

interface IUserInfo {
	username: string;
	email: string;
	socialGithub: string;
	balance?: number;
}

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

	static async findBySocialGithub(socialGithub: string): Promise<User> {
		const userRepository: UserRepository = getCustomRepository(UserRepository);
		const user = await userRepository.findOne({ where: { socialGithub } });
		if (!user) throw new UserError(UserErrorMessage.NOT_EXIST_USER);
		return user;
	}

	static async signUp({ username, email, socialGithub, balance = 0 }: IUserInfo): Promise<boolean> {
		const userRepository: UserRepository = getCustomRepository(UserRepository);

		return userRepository.createUser(
			userRepository.create({
				username,
				email,
				socialGithub,
				balance,
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
