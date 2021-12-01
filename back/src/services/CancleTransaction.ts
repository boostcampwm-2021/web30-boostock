import { QueryRunner } from 'typeorm';
import { Order, ORDERTYPE, User } from '@models/index';
import { OrderRepository, UserRepository, UserStockRepository } from '@repositories/index';

export default class CancleTransaction {
	userId: number;

	order: Order;

	userRepository: UserRepository;

	userStockRepository: UserStockRepository;

	orderRepository: OrderRepository;

	constructor(userId, order, queryRunner: QueryRunner) {
		this.userId = userId;
		this.order = order;
		this.userRepository = queryRunner.manager.getCustomRepository(UserRepository);
		this.userStockRepository = queryRunner.manager.getCustomRepository(UserStockRepository);
		this.orderRepository = queryRunner.manager.getCustomRepository(OrderRepository);
	}

	public async updateUser(user: User) {
		if (this.order.type === ORDERTYPE.BID) {
			const payout: number = this.order.price * this.order.amount;
			await this.userRepository.updateBalance(this.userId, payout * -1);
		}
		if (this.order.type === ORDERTYPE.ASK) {
			let holdStock = await this.userStockRepository.read(this.userId, this.order.stockId);
			if (holdStock) {
				holdStock = await this.userStockRepository.readLock(holdStock.userStockId, 'pessimistic_write');
				holdStock.amount += this.order.amount;
				await this.userStockRepository.updateQueryRunner(holdStock);
			} else {
				await this.userStockRepository.insertQueryRunner({
					userId: this.userId,
					stockId: this.order.stockId,
					amount: this.order.amount,
					average: this.order.price,
				});
			}
		}
	}

	public async removeOrder() {
		await this.orderRepository.removeOrderOCC(this.order);
	}
}
