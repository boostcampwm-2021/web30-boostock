/* eslint-disable class-methods-use-this */
import { getConnection } from 'typeorm';
import {
	AskOrderRepository,
	BidOrderRepository,
	StockRepository,
	UserRepository,
	UserStockRepository,
} from '@repositories/index';
import { CommonError, CommonErrorMessage, OrderError, OrderErrorMessage } from '@errors/index';
import { IOrder } from '@interfaces/IOrder';
import { ORDERTYPE } from '@models/AskOrder';
import OrderTransaction from './OrderTransaction';
import CancleTransaction from './CancleTransaction';

export default class OrderService {
	static instance: OrderService | null = null;

	constructor() {
		if (OrderService.instance) return OrderService.instance;
		OrderService.instance = this;
	}

	static async order(userId: number, stockCode: string, type: number, amount: number, price: number): Promise<void> {
		const queryRunner = getConnection().createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const [stock, user] = await Promise.all([
				queryRunner.manager.getCustomRepository(StockRepository).readByCode(stockCode),
				queryRunner.manager.getCustomRepository(UserRepository).readByIdLock(userId, 'pessimistic_write'),
			]);
			const task = new OrderTransaction(userId, stock.stockId, type, price, amount, queryRunner);
			await Promise.all([task.updateUser(user), task.insertOrder()]);
			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	static async cancel(userId: number, type: number, orderId: number): Promise<void> {
		const queryRunner = getConnection().createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			let order;
			if (type === ORDERTYPE.ASK)
				order = await queryRunner.manager.getCustomRepository(AskOrderRepository).readById(orderId);
			else if (type === ORDERTYPE.BID)
				order = await queryRunner.manager.getCustomRepository(BidOrderRepository).readById(orderId);
			else throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
			const user = await queryRunner.manager.getCustomRepository(UserRepository).readByIdLock(userId, 'pessimistic_write');
			if (order.userId !== userId) throw new OrderError(OrderErrorMessage.INVALID_ORDER);
			const task = new CancleTransaction(userId, type, order, queryRunner);
			await Promise.all([task.updateUser(user), task.removeOrder()]);
			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	public async getBidAskOrders(stockId: number): Promise<{ askOrders: IOrder[]; bidOrders: IOrder[] }> {
		const connection = getConnection();
		const queryRunner = connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const askOrderRepository = queryRunner.manager.getCustomRepository(AskOrderRepository);
			const bidOrderRepository = queryRunner.manager.getCustomRepository(BidOrderRepository);
			const [askOrders, bidOrders] = await Promise.all([
				askOrderRepository.readSummary(stockId),
				bidOrderRepository.readSummary(stockId),
			]);
			await queryRunner.commitTransaction();
			return { askOrders, bidOrders };
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}
}
