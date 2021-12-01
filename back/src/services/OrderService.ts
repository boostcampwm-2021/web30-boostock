/* eslint-disable class-methods-use-this */
import { getConnection } from 'typeorm';
import { OrderRepository, StockRepository, UserRepository, UserStockRepository } from '@repositories/index';
import { OrderError, OrderErrorMessage } from '@errors/index';
import { IOrder } from '@interfaces/IOrder';
import { ORDERTYPE } from '@models/Order';
import OrderTransaction from './OrderTransaction';
import CancleTransaction from './CancleTransaction';

export default class OrderService {
	static instance: OrderService | null = null;

	constructor() {
		if (OrderService.instance) return OrderService.instance;
		OrderService.instance = this;
	}

	// Deprecated
	// private getOrderRepository(entityManager: EntityManager): OrderRepository {
	// 	const orderRepository: OrderRepository | null = entityManager.getCustomRepository(OrderRepository);

	// 	if (!entityManager || !orderRepository) throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
	// 	return orderRepository;
	// }

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

	static async cancel(userId: number, orderId: number): Promise<void> {
		const queryRunner = getConnection().createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const [order, user] = await Promise.all([
				queryRunner.manager.getCustomRepository(OrderRepository).readById(orderId),
				queryRunner.manager.getCustomRepository(UserRepository).readByIdLock(userId, 'pessimistic_write'),
			]);
			if (order.userId !== userId) throw new OrderError(OrderErrorMessage.INVALID_ORDER);
			const task = new CancleTransaction(userId, order, queryRunner);
			await Promise.all([task.updateUser(user), task.removeOrder()]);
			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	// Deprecated
	// static async modify(userId: number, orderId: number, amount: number, price: number): Promise<void> {
	// 	const queryRunner = getConnection().createQueryRunner();
	// 	const orderRepository = queryRunner.manager.getCustomRepository(OrderRepository);
	// 	const userRepository = queryRunner.manager.getCustomRepository(UserRepository);
	// 	const stockRepository = queryRunner.manager.getCustomRepository(StockRepository);
	// 	const userStockRepository = queryRunner.manager.getCustomRepository(UserStockRepository);

	// 	await queryRunner.connect();
	// 	await queryRunner.startTransaction();
	// 	try {
	// 		const order = await orderRepository.readOrderById(orderId);
	// 		if (!order || order.userId !== userId) throw new OrderError(OrderErrorMessage.INVALID_ORDER);
	// 		const user = await userRepository.readByIdLock(userId);
	// 		const stock = await stockRepository.readById(order.stockId);
	// 		if (!user || !stock) throw new OrderError(OrderErrorMessage.INVALID_DATA);

	// 		if (order.type === ORDERTYPE.ASK) {
	// 			const holdStock = await userStockRepository.readLock(userId, stock.stockId);
	// 			if (!holdStock) throw new OrderError(OrderErrorMessage.NOT_ENOUGH_STOCK);

	// 			holdStock.amount -= amount + order.amount;
	// 			if (holdStock.amount > 0) await userStockRepository.save(holdStock);
	// 			else await userStockRepository.delete(holdStock.userStockId);
	// 		}
	// 		if (order.type === ORDERTYPE.BID) {
	// 			const payout = price * amount - order.price * order.amount;
	// 			if (user.balance < payout) throw new OrderError(OrderErrorMessage.NOT_ENOUGH_BALANCE);

	// 			user.balance -= payout;
	// 			await userRepository.save(user);
	// 		}

	// 		await orderRepository.updateOrder(
	// 			orderRepository.create({
	// 				orderId: order.orderId,
	// 				price,
	// 				amount,
	// 			}),
	// 		);
	// 		await queryRunner.commitTransaction();
	// 	} catch (error) {
	// 		await queryRunner.rollbackTransaction();
	// 		throw error;
	// 	} finally {
	// 		await queryRunner.release();
	// 	}
	// }

	public async getBidAskOrders(stockId: number): Promise<{ askOrders: IOrder[]; bidOrders: IOrder[] }> {
		const connection = getConnection();
		const queryRunner = connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const orderRepository = queryRunner.manager.getCustomRepository(OrderRepository);
			const [askOrders, bidOrders] = await Promise.all([
				orderRepository.readSummary(stockId, ORDERTYPE.ASK),
				orderRepository.readSummary(stockId, ORDERTYPE.BID),
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
