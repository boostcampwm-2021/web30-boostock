/* eslint-disable class-methods-use-this */
import { EntityManager, getCustomRepository } from 'typeorm';
import { OrderRepository, SessionRepository, StockRepository, UserRepository } from '@repositories/index';
import {
	CommonError,
	CommonErrorMessage,
	ParamError,
	ParamErrorMessage,
	StockError,
	StockErrorMessage,
	UserError,
	UserErrorMessage,
} from '@errors/index';
import { User, UserBalance, IBalanceLog, TransactionLog, ITransactionLog, ORDERTYPE } from '@models/index';

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

	static async readPendingOrder(userId: number, stockCode: string): Promise<unknown> {
		const orderRepository = getCustomRepository(OrderRepository);
		const stockRepository = getCustomRepository(StockRepository);
		if (stockCode) {
			const stock = await stockRepository.findOne({ where: { code: stockCode } });
			if (stock === undefined) throw new StockError(StockErrorMessage.NOT_EXIST_STOCK);
			const orders = await orderRepository.find({
				select: ['orderId', 'type', 'amount', 'price'],
				where: { userId, stockId: stock.stockId },
			});
			const result = orders.map((elem) => {
				return { orderId: elem.orderId, stockCode, type: elem.type, amount: elem.amount, price: elem.price };
			});

			return result || [];
		}
		const orders = await orderRepository.find({
			select: ['stockId', 'type', 'amount', 'price'],
			where: { userId },
			relations: ['stock'],
		});
		const result = orders.map((elem) => {
			return {
				stockCode: elem.stock.code,
				type: elem.type,
				amount: elem.amount,
				price: elem.price,
			};
		});

		return result || [];
	}

	static async readTransactionLog(userId: number, start: number, end: number, type = 0): Promise<ITransactionLog[]> {
		if (type) {
			const document = await TransactionLog.find()
				.select('-_id -__v -transactionId -bidUserId -askUserId')
				.where('type', type)
				.or([{ bidUserId: userId }, { askUserId: userId }])
				.gte('createdAt', start)
				.lt('createdAt', end)
				.sort('createdAt');

			return document || [];
		}
		const document = await TransactionLog.find()
			.select('-_id -__v -transactionId -bidUserId -askUserId')
			.or([{ bidUserId: userId }, { askUserId: userId }])
			.gte('createdAt', start)
			.lt('createdAt', end)
			.sort('createdAt');
		return document || [];
	}

	static async readBalanceLog(userId: number, start: number, end: number, type = 0): Promise<IBalanceLog[]> {
		if (type) {
			const document = await UserBalance.findOne()
				.select('-_id -__v -balanceLog._id')
				.where('userId', userId)
				.where('balanceHistroy.type', type)
				.all([{ userId }, { 'balanceLog.type': type }])
				.gte('balanceLog.createdAt', start)
				.lt('balanceLog.createdAt', end)
				.sort('balanceLog.createdAt');
			return document?.balanceLog || [];
		}
		const document = await UserBalance.findOne()
			.select('-_id -__v -balanceLog._id')
			.where('userId', userId)
			.gte('balanceLog.createdAt', start)
			.lt('balanceLog.createdAt', end)
			.sort('balanceLog.createdAt');
		return document?.balanceLog || [];
	}

	static async pushBalanceLog(userId: number, newBalanceLog: IBalanceLog): Promise<void> {
		const document = await UserBalance.findOne({ userId });
		if (document) {
			document.balanceLog.push(newBalanceLog);
			document.save((err) => {
				if (err) throw err;
			});
		} else {
			const newDocument = new UserBalance({
				userId,
			});
			newDocument.balanceLog.push(newBalanceLog);
			newDocument.save();
		}
	}
}
