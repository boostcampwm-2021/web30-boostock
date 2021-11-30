import { QueryRunner } from 'typeorm';
import { ORDERTYPE, User } from '@models/index';
import { UserRepository, UserStockRepository, OrderRepository } from '@repositories/index';
import { OrderError, OrderErrorMessage } from '@errors/index';

export default class OrderTransaction {
	userId: number;

	stockId: number;

	type: number;

	price: number;

	amount: number;

	userRepository: UserRepository;

	userStockRepository: UserStockRepository;

	orderRepository: OrderRepository;

	constructor(userId, stockId, type, price, amount, queryRunner: QueryRunner) {
		this.userId = userId;
		this.stockId = stockId;
		this.type = type;
		this.price = price;
		this.amount = amount;
		this.userRepository = queryRunner.manager.getCustomRepository(UserRepository);
		this.userStockRepository = queryRunner.manager.getCustomRepository(UserStockRepository);
		this.orderRepository = queryRunner.manager.getCustomRepository(OrderRepository);
	}

	public async updateUser(user: User) {
		if (this.type === ORDERTYPE.ASK) {
			let holdStock = await this.userStockRepository.read(this.userId, this.stockId);
			if (holdStock) holdStock = await this.userStockRepository.readLock(holdStock.userStockId, 'pessimistic_write');

			if (holdStock === undefined || holdStock.amount < this.amount)
				throw new OrderError(OrderErrorMessage.NOT_ENOUGH_STOCK);
			holdStock.amount -= this.amount;
			if (holdStock.amount > 0) await this.userStockRepository.save(holdStock);
			else await this.userStockRepository.delete(holdStock.userStockId);
		}

		if (this.type === ORDERTYPE.BID) {
			const payout: number = this.price * this.amount;
			if (user.balance < payout) throw new OrderError(OrderErrorMessage.NOT_ENOUGH_BALANCE);

			await this.userRepository.updateBalance(this.userId, payout * -1);
		}
	}

	public async insertOrder() {
		await this.orderRepository.save(
			this.orderRepository.create({
				userId: this.userId,
				stockId: this.stockId,
				type: this.type,
				amount: this.amount,
				price: this.price,
				createdAt: new Date(),
			}),
		);
	}
}
