import { QueryRunner } from 'typeorm';
import { ORDERTYPE, User } from '@models/index';
import { UserRepository, UserStockRepository, AskOrderRepository, BidOrderRepository } from '@repositories/index';
import { OrderError, OrderErrorMessage } from '@errors/index';

export default class OrderTransaction {
	userId: number;

	stockId: number;

	type: number;

	price: number;

	amount: number;

	userRepository: UserRepository;

	userStockRepository: UserStockRepository;

	askOrderRepository: AskOrderRepository;

	bidOrderRepository: BidOrderRepository;

	constructor(userId, stockId, type, price, amount, queryRunner: QueryRunner) {
		this.userId = userId;
		this.stockId = stockId;
		this.type = type;
		this.price = price;
		this.amount = amount;
		this.userRepository = queryRunner.manager.getCustomRepository(UserRepository);
		this.userStockRepository = queryRunner.manager.getCustomRepository(UserStockRepository);
		this.askOrderRepository = queryRunner.manager.getCustomRepository(AskOrderRepository);
		this.bidOrderRepository = queryRunner.manager.getCustomRepository(BidOrderRepository);
	}

	public async updateUser(user: User) {
		if (this.type === ORDERTYPE.ASK) {
			let holdStock = await this.userStockRepository.read(this.userId, this.stockId);
			if (holdStock === undefined || holdStock.amount < this.amount)
				throw new OrderError(OrderErrorMessage.NOT_ENOUGH_STOCK);
			if (holdStock) holdStock = await this.userStockRepository.readLock(holdStock.userStockId, 'pessimistic_write');
			holdStock.amount -= this.amount;
			if (holdStock.amount > 0) await this.userStockRepository.updateQueryRunner(holdStock);
			else await this.userStockRepository.delete(holdStock.userStockId);
		}

		if (this.type === ORDERTYPE.BID) {
			const payout: number = this.price * this.amount;
			if (user.balance < payout) throw new OrderError(OrderErrorMessage.NOT_ENOUGH_BALANCE);

			await this.userRepository.updateBalance(this.userId, payout * -1);
		}
	}

	public async insertOrder(): Promise<void> {
		if (this.type === ORDERTYPE.ASK) {
			await this.askOrderRepository.insertQueryRunner({
				userId: this.userId,
				stockId: this.stockId,
				amount: this.amount,
				price: this.price,
				createdAt: new Date(),
			});
		} else if (this.type === ORDERTYPE.BID) {
			await this.bidOrderRepository.insertQueryRunner({
				userId: this.userId,
				stockId: this.stockId,
				amount: this.amount,
				price: this.price,
				createdAt: new Date(),
			});
		}
	}
}
