/* eslint-disable class-methods-use-this */
import { EntityManager, getCustomRepository, LessThan } from 'typeorm';
import { AskOrderRepository, BidOrderRepository, SessionRepository, UserRepository } from '@repositories/index';
import { CommonError, CommonErrorMessage, ParamError, ParamErrorMessage, UserError, UserErrorMessage } from '@errors/index';
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

	static async signUp({ username, email, socialGithub, balance = 5000000 }: IUserInfo): Promise<User> {
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

	static async readByEmail(email: string): Promise<void> {
		if (!checkEmail(email)) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
		const userRepository: UserRepository = getCustomRepository(UserRepository);
		const user = await userRepository.findOne({ where: { email } });
		if (user !== undefined) throw new UserError(UserErrorMessage.EXIST_USER);
	}

	static async readById(id: number): Promise<User> {
		const userRepository: UserRepository = getCustomRepository(UserRepository);
		const user = await userRepository.findOne({ where: { userId: id } });
		if (!user) throw new UserError(UserErrorMessage.NOT_EXIST_USER);
		return user;
	}

	static async updateBalance(userId: number, changeValue: number): Promise<void> {
		const userRepository = getCustomRepository(UserRepository);
		await userRepository.updateBalance(userId, changeValue);
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

	static async readPendingOrder(userId: number, type: number, end: number): Promise<unknown> {
		let orderRepository;
		if (type === ORDERTYPE.ASK) orderRepository = getCustomRepository(AskOrderRepository);
		else if (type === ORDERTYPE.BID) orderRepository = getCustomRepository(BidOrderRepository);
		const orders = await orderRepository.find({
			select: ['orderId', 'amount', 'price', 'createdAt'],
			where: { userId, orderId: LessThan(end > 0 ? end : Number.MAX_SAFE_INTEGER) },
			order: { orderId: 'DESC' },
			relations: ['stock'],
			take: 30,
		});

		return orders.map((elem) => {
			return {
				orderId: elem.orderId,
				stockCode: elem.stock.code,
				type,
				amount: elem.amount,
				price: elem.price,
				createdAt: elem.createdAt,
			};
		});
	}

	static async readTransactionLog(userId: number, start: number, end: number, type = 0): Promise<ITransactionLog[]> {
		let document;
		if (type) {
			document = await TransactionLog.find()
				.select('-_id -__v -transactionId')
				.where('type', type)
				.or([{ bidUserId: userId }, { askUserId: userId }])
				.gte('createdAt', start)
				.lt('createdAt', end)
				.sort({ createdAt: -1 })
				.limit(30);
		}
		document = await TransactionLog.find()
			.select('-_id -__v -transactionId')
			.or([{ bidUserId: userId }, { askUserId: userId }])
			.gte('createdAt', start)
			.lt('createdAt', end)
			.sort({ createdAt: -1 })
			.limit(30);
		return document.map((elem) => {
			return {
				stockCode: elem.stockCode,
				amount: elem.amount,
				price: elem.price,
				type: elem.bidUserId === userId ? ORDERTYPE.BID : ORDERTYPE.ASK,
				createdAt: elem.createdAt,
			};
		});
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
