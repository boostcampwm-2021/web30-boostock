/* eslint-disable class-methods-use-this */
import { EntityManager } from 'typeorm';
import { Stock, User, UserStock, OrderType, OrderStatus } from '@models/index';
import { OrderRepository } from '@repositories/index';
import { UserService, UserStockService, StockService } from '@services/index';
import { CommonError, CommonErrorMessage, OrderError, OrderErrorMessage } from '@services/errors/index';
import { IBidAskOrder } from '@interfaces/bidAskOrder';

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

	public async order(
		entityManager: EntityManager,
		orderData: {
			userId: number;
			stockCode: string;
			type: OrderType;
			amount: number;
			price: number;
		},
	): Promise<void> {
		const userService: UserService = new UserService();
		const stockService: StockService = new StockService();
		const orderRepository: OrderRepository = this.getOrderRepository(entityManager);

		const user: User = await userService.getUserById(entityManager, orderData.userId);
		const stock: Stock = await stockService.getStockByCode(entityManager, orderData.stockCode);
		if (!user || !stock) throw new OrderError(OrderErrorMessage.INVALID_DATA);

		if (orderData.type === OrderType.SELL) {
			const holdStock: UserStock | undefined = user.stocks.filter((st) => st.stockId === stock.stockId)[0];
			if (!holdStock || holdStock.amount < orderData.amount) throw new OrderError(OrderErrorMessage.NOT_ENOUGH_STOCK);

			const userStockService: UserStockService = new UserStockService();
			await userStockService.setAmount(entityManager, holdStock.userStockId, holdStock.amount - orderData.amount);
		}

		if (orderData.type === OrderType.BUY) {
			const payout: number = orderData.price * orderData.amount;
			if (user.balance < payout) throw new OrderError(OrderErrorMessage.NOT_ENOUGH_BALANCE);

			await userService.setBalance(entityManager, user.userId, user.balance - payout);
		}

		await orderRepository.createOrder(
			orderRepository.create({
				userId: user.userId,
				stockId: stock.stockId,
				type: orderData.type,
				amount: orderData.amount,
				price: orderData.price,
				createdAt: new Date(),
				status: OrderStatus.PENDING,
			}),
		);
	}

	public async cancel(
		entityManager: EntityManager,
		orderData: {
			userId: number;
			orderId: number;
		},
	): Promise<void> {
		const userService: UserService = new UserService();
		const stockService: StockService = new StockService();
		const orderRepository: OrderRepository = this.getOrderRepository(entityManager);

		const order = await orderRepository.readOrderById(orderData.orderId);
		if (!order || order.userId !== orderData.userId || order.status !== OrderStatus.PENDING)
			throw new OrderError(OrderErrorMessage.INVALID_ORDER);

		const user: User = await userService.getUserById(entityManager, orderData.userId);
		const stock: Stock = await stockService.getStockById(entityManager, order.stockId);
		if (!user || !stock) throw new OrderError(OrderErrorMessage.INVALID_DATA);

		if (order.type === OrderType.SELL) {
			const holdStock: UserStock | undefined = user.stocks.filter((st) => st.stockId === stock.stockId)[0];
			if (!holdStock) throw new OrderError(OrderErrorMessage.NOT_ENOUGH_STOCK);

			const userStockService: UserStockService = new UserStockService();
			await userStockService.setAmount(entityManager, holdStock.userStockId, holdStock.amount + order.amount);
		}

		if (order.type === OrderType.BUY) {
			const payout: number = order.price * order.amount;
			await userService.setBalance(entityManager, user.userId, user.balance + payout);
		}

		await orderRepository.updateOrder(
			orderRepository.create({
				orderId: order.orderId,
				status: OrderStatus.CANCELED,
			}),
		);
	}

	public async modify(
		entityManager: EntityManager,
		orderData: {
			userId: number;
			orderId: number;
			amount: number;
			price: number;
		},
	): Promise<void> {
		const userService: UserService = new UserService();
		const stockService: StockService = new StockService();
		const orderRepository: OrderRepository = this.getOrderRepository(entityManager);

		const order = await orderRepository.readOrderById(orderData.orderId);
		if (!order || order.userId !== orderData.userId || order.status !== OrderStatus.PENDING)
			throw new OrderError(OrderErrorMessage.INVALID_ORDER);

		const user: User = await userService.getUserById(entityManager, orderData.userId);
		const stock: Stock = await stockService.getStockById(entityManager, order.stockId);
		if (!user || !stock) throw new OrderError(OrderErrorMessage.INVALID_DATA);

		if (order.type === OrderType.SELL) {
			const holdStock: UserStock | undefined = user.stocks.filter((st) => st.stockId === stock.stockId)[0];
			if (!holdStock) throw new OrderError(OrderErrorMessage.NOT_ENOUGH_STOCK);

			const userStockService: UserStockService = new UserStockService();
			await userStockService.setAmount(
				entityManager,
				holdStock.userStockId,
				holdStock.amount - orderData.amount + order.amount,
			);
		}

		if (order.type === OrderType.BUY) {
			const payout: number = orderData.price * orderData.amount - order.price * order.amount;
			if (user.balance < payout) throw new OrderError(OrderErrorMessage.NOT_ENOUGH_BALANCE);

			await userService.setBalance(entityManager, user.userId, user.balance - payout);
		}

		await orderRepository.updateOrder(
			orderRepository.create({
				orderId: order.orderId,
				price: orderData.price,
				amount: orderData.amount,
			}),
		);
	}

	public async getBidAskOrders(entityManager: EntityManager, stockId: number): Promise<IBidAskOrder[]> {
		const stockService: StockService = new StockService();
		const orderRepository: OrderRepository = this.getOrderRepository(entityManager);

		const { price } = await stockService.getCurrentStockPrice(entityManager, stockId);
		const askOrders = await orderRepository.getOrders(stockId, '1', price);
		const bidOrders = await orderRepository.getOrders(stockId, '2', price);

		return [...askOrders, ...bidOrders];
	}
}
