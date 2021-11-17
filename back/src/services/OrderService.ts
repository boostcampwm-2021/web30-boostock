/* eslint-disable class-methods-use-this */
import { EntityManager, getConnection, getCustomRepository } from 'typeorm';
import { OrderType, OrderStatus } from '@models/index';
import { OrderRepository, StockRepository, UserRepository, UserStockRepository } from '@repositories/index';
import { UserService } from '@services/index';
import { CommonError, CommonErrorMessage, OrderError, OrderErrorMessage } from '@services/errors/index';
import { IAskOrder } from '@interfaces/askOrder';
import { IBidOrder } from '@interfaces/bidOrder';

export default class OrderService {
	static instance: OrderService | null = null;

	constructor() {
		if (OrderService.instance) return OrderService.instance;
		OrderService.instance = this;
	}

	private getOrderRepository(entityManager: EntityManager): OrderRepository {
		const orderRepository: OrderRepository | null = entityManager.getCustomRepository(OrderRepository);

		if (!entityManager || !orderRepository) throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return orderRepository;
	}

	static async order(userId: number, stockCode: string, type: number, amount: number, price: number): Promise<void> {
		const queryRunner = getConnection().createQueryRunner();
		const orderRepository = queryRunner.manager.getCustomRepository(OrderRepository);
		const userRepository = queryRunner.manager.getCustomRepository(UserRepository);
		const stockRepository = queryRunner.manager.getCustomRepository(StockRepository);
		const userStockRepository = queryRunner.manager.getCustomRepository(UserStockRepository);

		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const [user, stock] = await Promise.all([
				userRepository.readUserById(userId),
				stockRepository.readStockByCode(stockCode),
			]);
			if (!user || !stock) throw new OrderError(OrderErrorMessage.INVALID_DATA);

			if (type === OrderType.SELL) {
				const holdStock = await userStockRepository.readUserStockLock(userId, stock.stockId);
				// const holdStock = user.stocks.filter((st) => st.stockId === stock.stockId)[0];
				if (holdStock === undefined || holdStock.amount < amount)
					throw new OrderError(OrderErrorMessage.NOT_ENOUGH_STOCK);

				holdStock.amount -= amount;
				await userStockRepository.save(holdStock);
			}

			if (type === OrderType.BUY) {
				const payout: number = price * amount;
				if (user.balance < payout) throw new OrderError(OrderErrorMessage.NOT_ENOUGH_BALANCE);

				user.balance -= payout;
				await userRepository.save(user);
			}
			await orderRepository.save(
				orderRepository.create({
					userId: user.userId,
					stockId: stock.stockId,
					type,
					amount,
					price,
					createdAt: new Date(),
					status: OrderStatus.PENDING,
				}),
			);
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
		const orderRepository = queryRunner.manager.getCustomRepository(OrderRepository);
		const userRepository = queryRunner.manager.getCustomRepository(UserRepository);
		const stockRepository = queryRunner.manager.getCustomRepository(StockRepository);
		const userStockRepository = queryRunner.manager.getCustomRepository(UserStockRepository);

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const order = await orderRepository.readOrderById(orderId);
			if (!order || order.userId !== userId || order.status !== OrderStatus.PENDING)
				throw new OrderError(OrderErrorMessage.INVALID_ORDER);

			const user = await userRepository.readUserById(userId);
			const stock = await stockRepository.readStockById(order.stockId);
			if (!user || !stock) throw new OrderError(OrderErrorMessage.INVALID_DATA);
			if (order.type === OrderType.SELL) {
				const holdStock = await userStockRepository.readUserStockLock(userId, stock.stockId);
				// const holdStock = user.stocks.filter((st) => st.stockId === stock.stockId)[0];
				if (holdStock) {
					holdStock.amount += order.amount;
					await userStockRepository.save(holdStock);
				} else {
					await userStockRepository.save(
						userStockRepository.create({
							userId,
							stockId: order.stockId,
							amount: order.amount,
							average: order.price,
						}),
					);
				}
			}
			if (order.type === OrderType.BUY) {
				const payout: number = order.price * order.amount;
				user.balance -= payout;
				await userRepository.save(user);
			}
			await orderRepository.save(
				orderRepository.create({
					orderId: order.orderId,
					status: OrderStatus.CANCELED,
				}),
			);
			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	static async modify(userId: number, orderId: number, amount: number, price: number): Promise<void> {
		const queryRunner = getConnection().createQueryRunner();
		const orderRepository = queryRunner.manager.getCustomRepository(OrderRepository);
		const userRepository = queryRunner.manager.getCustomRepository(UserRepository);
		const stockRepository = queryRunner.manager.getCustomRepository(StockRepository);
		const userStockRepository = queryRunner.manager.getCustomRepository(UserStockRepository);

		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const order = await orderRepository.readOrderById(orderId);
			if (!order || order.userId !== userId || order.status !== OrderStatus.PENDING)
				throw new OrderError(OrderErrorMessage.INVALID_ORDER);
			const user = await userRepository.readUserById(userId);
			const stock = await stockRepository.readStockById(order.stockId);
			if (!user || !stock) throw new OrderError(OrderErrorMessage.INVALID_DATA);

			if (order.type === OrderType.SELL) {
				const holdStock = await userStockRepository.readUserStockLock(userId, stock.stockId);
				if (!holdStock) throw new OrderError(OrderErrorMessage.NOT_ENOUGH_STOCK);

				holdStock.amount -= amount + order.amount;
				await userStockRepository.save(holdStock);
			}
			if (order.type === OrderType.BUY) {
				const payout = price * amount - order.price * order.amount;
				if (user.balance < payout) throw new OrderError(OrderErrorMessage.NOT_ENOUGH_BALANCE);

				user.balance -= payout;
				await userRepository.save(user);
			}

			await orderRepository.updateOrder(
				orderRepository.create({
					orderId: order.orderId,
					price,
					amount,
				}),
			);
			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	// public async getBidAskOrders(
	// 	entityManager: EntityManager,
	// 	stockId: number,
	// ): Promise<{ askOrders: IAskOrder[]; bidOrders: IBidOrder[] }> {
	// 	const orderRepository: OrderRepository = this.getOrderRepository(entityManager);

	// 	const askOrders = (await orderRepository.getOrders(stockId, '1')) as IAskOrder[];
	// 	const bidOrders = (await orderRepository.getOrders(stockId, '2')) as IBidOrder[];

	// 	return { askOrders, bidOrders };
	// }
	public async getBidAskOrders(stockId: number): Promise<{ askOrders: IAskOrder[]; bidOrders: IBidOrder[] }> {
		const connection = getConnection();
		const queryRunner = connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const orderRepository: OrderRepository = this.getOrderRepository(queryRunner.manager);

			const askOrders = (await orderRepository.getOrders(stockId, '1')) as IAskOrder[];
			const bidOrders = (await orderRepository.getOrders(stockId, '2')) as IBidOrder[];
			queryRunner.commitTransaction();

			return { askOrders, bidOrders };
		} catch (error) {
			queryRunner.rollbackTransaction();
		} finally {
			queryRunner.release();
		}
		return { askOrders: [], bidOrders: [] };
	}
}
