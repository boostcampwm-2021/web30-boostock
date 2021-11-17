/* eslint-disable class-methods-use-this */
import { EntityManager, getCustomRepository } from 'typeorm';
import { User } from '@models/index';
import { UserRepository } from '@repositories/index';
import {
	CommonError,
	CommonErrorMessage,
	ParamError,
	ParamErrorMessage,
	UserError,
	UserErrorMessage,
} from '@services/errors/index';

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
		if (!checkEmail(email)) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
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

	static async getUserBySocialGithub(socialGithub: string): Promise<User> {
		const userRepository: UserRepository = getCustomRepository(UserRepository);
		const user = await userRepository.findOne({ where: { socialGithub } });
		if (!user) throw new UserError(UserErrorMessage.NOT_EXIST_USER);
		return user;
	}

	static async getUserByEmail(email: string): Promise<User> {
		if (!checkEmail(email)) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
		const userRepository: UserRepository = getCustomRepository(UserRepository);
		const user = await userRepository.findOne({ where: { email } });
		if (user === undefined) throw new UserError(UserErrorMessage.NOT_EXIST_USER);
		return user;
	}

	static async getUserById(id: number): Promise<User> {
		const userRepository: UserRepository = getCustomRepository(UserRepository);
		const user = await userRepository.findOne({ where: { userId: id } });
		if (!user) throw new UserError(UserErrorMessage.NOT_EXIST_USER);
		return user;
	}

	static async updateBalance(userId: number, changeValue: number): Promise<User> {
		const userRepository: UserRepository = getCustomRepository(UserRepository);
		const user = await userRepository.findOne({ where: { userId } });
		if (user === undefined) throw new UserError(UserErrorMessage.NOT_EXIST_USER);
		user.balance += changeValue;
		if (user.balance < 0) throw new ParamError(ParamErrorMessage.BALANCE_CANNOT_BE_NEGATIVE);
		await userRepository.updateUser(user);
		return user;
	}

	public async signOut(user: User): Promise<User> {
		const userRepository: UserRepository = getCustomRepository(UserRepository);
		await userRepository.remove(user);
		return user;
	}
}
