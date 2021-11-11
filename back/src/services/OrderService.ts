/* eslint-disable class-methods-use-this */
import { EntityManager } from 'typeorm';
import { User, Stock, Order, OrderType, OrderStatus } from '@models/index';
import { OrderRepository } from '@repositories/index';
import { UserService, UserStockService, StockService } from '@services/index';
import { CommonError, CommonErrorMessage, OrderError, OrderErrorMessage } from '@services/errors/index';

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

	private isValidOrderId(orderId: number): boolean {
		if (!Number.isInteger(orderId)) return false;
		if (orderId < 1) return false;
		return true;
	}

	private isValidUserId(userId: number): boolean {
		if (!Number.isInteger(userId)) return false;
		if (userId < 1) return false;
		return true;
	}

	private isValidStockCode(stockCode: string): boolean {
		if (typeof stockCode !== 'string') return false;
		return true;
	}

	private isValidType(type: OrderType): boolean {
		if (!Number.isInteger(type)) return false;
		if (
			!Object.values(OrderType)
				.filter((v) => typeof v === 'number')
				.includes(type)
		)
			return false;

		return true;
	}

	private isValidAmount(amount: number, type: OrderType, holdStockAmount: number): boolean {
		if (!Number.isInteger(amount)) return false;
		if (amount < 1) return false;
		if (type === OrderType.SELL && holdStockAmount < amount) return false;

		return true;
	}

	private isValidPrice(price: number, unit: number): boolean {
		if (!Number.isInteger(price)) return false;
		if (price < 1) return false;
		if (price % unit !== 0) return false;

		return true;
	}

	public async getOrderById(entityManager: EntityManager, id: number): Promise<Order> {
		if (!this.isValidOrderId(id)) throw new CommonError(CommonErrorMessage.INVALID_REQUEST);

		const orderRepository: OrderRepository = this.getOrderRepository(entityManager);

		const orderEntity = await orderRepository.readOrderById(id);
		if (!orderEntity) throw new OrderError(OrderErrorMessage.NOT_EXIST_ORDER);
		return orderEntity;
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
	): Promise<boolean> {
		if (!this.isValidUserId(orderData.userId)) throw new CommonError(CommonErrorMessage.INVALID_REQUEST);
		if (!this.isValidStockCode(orderData.stockCode)) throw new CommonError(CommonErrorMessage.INVALID_REQUEST);

		const userService: UserService = new UserService();
		const stockService: StockService = new StockService();
		const orderRepository: OrderRepository = this.getOrderRepository(entityManager);

		const user: User = await userService.getUserById(entityManager, orderData.userId);
		const stock: Stock = await stockService.getStockByCode(entityManager, orderData.stockCode);
		const holdStock = user.stocks.filter((st) => st.stockId === stock.stockId)[0];
		const holdStockAmount = holdStock ? holdStock.amount : 0;
		const totalPrice: number = orderData.price * orderData.amount;

		if (!this.isValidType(orderData.type)) throw new OrderError(OrderErrorMessage.INVALID_TYPE);
		if (!this.isValidAmount(orderData.amount, orderData.type, holdStockAmount))
			throw new OrderError(OrderErrorMessage.INVALID_AMOUNT);
		if (!this.isValidPrice(orderData.price, stock.unit)) throw new OrderError(OrderErrorMessage.INVALID_PRICE);
		if (user.balance < totalPrice) throw new OrderError(OrderErrorMessage.LACK_OF_BALANCE);

		let resultUpdate = false;
		if (orderData.type === OrderType.SELL) {
			const userStockService: UserStockService = new UserStockService();
			resultUpdate = await userStockService.setAmount(
				entityManager,
				holdStock.userStockId,
				holdStockAmount - orderData.amount,
			);
		} else if (orderData.type === OrderType.BUY) {
			resultUpdate = await userService.setBalance(entityManager, user.userId, user.balance - totalPrice);
		}

		const orderEntity: Order = orderRepository.create({
			userId: user.userId,
			stockId: stock.stockId,
			type: orderData.type,
			amount: orderData.amount,
			price: orderData.price,
			createdAt: new Date(),
			status: OrderStatus.PENDING,
		});
		const resultOrder: boolean = await orderRepository.createOrder(orderEntity);

		if (!resultUpdate || !resultOrder) throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return true;
	}

	public async cancel(
		entityManager: EntityManager,
		orderData: {
			userId: number;
			orderId: number;
		},
	): Promise<boolean> {
		if (!this.isValidOrderId(orderData.userId)) throw new CommonError(CommonErrorMessage.INVALID_REQUEST);

		const userService: UserService = new UserService();
		const stockService: StockService = new StockService();
		const orderRepository: OrderRepository = this.getOrderRepository(entityManager);

		const order = await this.getOrderById(entityManager, orderData.orderId);
		if (order.userId !== orderData.userId) throw new OrderError(OrderErrorMessage.NOT_EXIST_ORDER);
		if (order.status !== OrderStatus.PENDING) throw new OrderError(OrderErrorMessage.NOT_PENDING_ORDER);

		const user: User = await userService.getUserById(entityManager, orderData.userId);
		const stock: Stock = await stockService.getStockById(entityManager, order.stockId);
		const holdStock = user.stocks.filter((st) => st.stockId === stock.stockId)[0];
		const holdStockAmount = holdStock ? holdStock.amount : 0;
		const totalPrice: number = order.price * order.amount;

		let resultUpdate = false;
		if (order.type === OrderType.SELL) {
			const userStockService: UserStockService = new UserStockService();
			resultUpdate = await userStockService.setAmount(entityManager, user.userId, holdStockAmount + order.amount);
		} else if (order.type === OrderType.BUY) {
			resultUpdate = await userService.setBalance(entityManager, user.userId, user.balance + totalPrice);
		}

		const orderEntity = orderRepository.create({
			orderId: order.orderId,
			status: OrderStatus.CANCELING,
		});

		const resultOrder: boolean = await orderRepository.updateOrder(orderEntity);
		if (!resultUpdate || !resultOrder) throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return true;
	}

	public async modify(
		entityManager: EntityManager,
		orderData: {
			userId: number;
			orderId: number;
			amount?: number;
			price?: number;
		},
	): Promise<boolean> {
		if (!this.isValidUserId(orderData.userId)) throw new CommonError(CommonErrorMessage.INVALID_REQUEST);
		if (!this.isValidOrderId(orderData.userId)) throw new CommonError(CommonErrorMessage.INVALID_REQUEST);

		const userService: UserService = new UserService();
		const stockService: StockService = new StockService();
		const orderRepository: OrderRepository = this.getOrderRepository(entityManager);

		const order = await this.getOrderById(entityManager, orderData.orderId);
		if (order.userId !== orderData.userId) throw new OrderError(OrderErrorMessage.NOT_EXIST_ORDER);
		if (order.status !== OrderStatus.PENDING) throw new OrderError(OrderErrorMessage.NOT_PENDING_ORDER);

		const user: User = await userService.getUserById(entityManager, orderData.userId);
		const stock: Stock = await stockService.getStockById(entityManager, order.stockId);

		const resultCancel: boolean = await this.cancel(entityManager, {
			userId: orderData.userId,
			orderId: orderData.orderId,
		});

		const resultOrder: boolean = await this.order(entityManager, {
			userId: orderData.userId,
			stockCode: stock.code,
			type: order.type,
			amount: order.amount,
			price: order.price,
		});

		if (!resultCancel || !resultOrder) throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return true;
	}
}
