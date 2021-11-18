/* eslint-disable class-methods-use-this */
import { EntityManager, getCustomRepository } from 'typeorm';
import { User } from '@models/index';
import { SessionRepository, UserRepository } from '@repositories/index';
import {
	CommonError,
	CommonErrorMessage,
	ParamError,
	ParamErrorMessage,
	UserError,
	UserErrorMessage,
} from '@services/errors/index';
import UserBalance, { IBalanceHistory } from '@models/UserBalance';

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
		if (!(await userRepository.createUser(user))) throw new UserError(UserErrorMessage.CANNOT_CREATE_USER);
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

	static async unregister(user: User): Promise<User> {
		const userRepository: UserRepository = getCustomRepository(UserRepository);
		await userRepository.remove(user);
		return user;
	}

	static async destroyAllSession(userId: number): Promise<void> {
		const sessionRepository = getCustomRepository(SessionRepository);
		const sessions = await sessionRepository.findById(userId);
		sessions.map((elem) => sessionRepository.delete(elem));
	}

	static async readBalanceHistory(userId: number, startTime: number, endTime: number, type = 0): Promise<IBalanceHistory[]> {
		const time = new Date();
		type = 1;
		if (type) {
			const document = await UserBalance.findOne({
				userId,
				'balanceHistory.createdAt': { $gte: 0, $lte: time },
				'balanceHistory.type': { $eq: type },
			});
			return document?.balanceHistory || [];
		}
		const document = await UserBalance.findOne({
			userId,
			'balanceHistory.createdAt': { $gte: startTime, $lte: endTime },
		});
		return document?.balanceHistory || [];
	}

	static async pushBalanceHistory(userId: number, newBalanceHistory: IBalanceHistory): Promise<void> {
		const document = await UserBalance.findOne({ userId });
		if (document) {
			document.balanceHistory.push(newBalanceHistory);
			document.save((err) => {
				if (err) throw err;
			});
		} else {
			const newDocument = new UserBalance({
				userId,
			});
			newDocument.balanceHistory.push(newBalanceHistory);
			newDocument.save();
		}
	}
}
