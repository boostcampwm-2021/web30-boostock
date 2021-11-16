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

function checkEmail(email: string): boolean {
	const regexp = /\S+@\S+\.\S+/;
	return regexp.test(email);
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

	static async signUp({ username, email, socialGithub, balance = 0 }: IUserInfo): Promise<User> {
		if (!checkEmail(email)) throw new UserError(UserErrorMessage.INVALID_PARAM);
		const userRepository: UserRepository = getCustomRepository(UserRepository);
		const user = userRepository.create({
			username,
			email,
			socialGithub,
			balance,
		});
		if (!userRepository.createUser(user)) throw new UserError(UserErrorMessage.CANNOT_CREATE_USER);
		return user;
	}

	static async findBySocialGithub(socialGithub: string): Promise<User> {
		const userRepository: UserRepository = getCustomRepository(UserRepository);
		const user = await userRepository.findOne({ where: { socialGithub } });
		if (!user) throw new UserError(UserErrorMessage.NOT_EXIST_USER);
		return user;
	}

	static async getUserById(id: number): Promise<User> {
		const userRepository: UserRepository = getCustomRepository(UserRepository);
		const user = await userRepository.readUserById(id);
		if (!user) throw new UserError(UserErrorMessage.NOT_EXIST_USER);
		return user;
	}

	static async updateBalance(id: number, balance: number): Promise<User> {
		const userRepository: UserRepository = getCustomRepository(UserRepository);
		const user = await userRepository.readUserById(id);
		if (!user) throw new UserError(UserErrorMessage.NOT_EXIST_USER);
		user.balance += balance;
		await userRepository.updateUser(user);
		return user;
	}

	public async deleteUser(entityManager: EntityManager, id: number): Promise<void> {
		const userRepository: UserRepository = this.getUserRepository(entityManager);
		await userRepository.deleteUser(id);
	}
}
