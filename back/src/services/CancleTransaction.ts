import { QueryRunner } from 'typeorm';
import { AskOrder, BidOrder, ORDERTYPE } from '@models/index';
import { AskOrderRepository, BidOrderRepository, UserRepository, UserStockRepository } from '@repositories/index';

export default class CancleTransaction {
	userId: number;

	order: AskOrder | BidOrder;

	type: number;

	userRepository: UserRepository;

	userStockRepository: UserStockRepository;

	askOrderRepository: AskOrderRepository;

	bidOrderRepository: BidOrderRepository;

	constructor(userId: number, type: number, order: AskOrder | BidOrder, queryRunner: QueryRunner) {
		this.userId = userId;
		this.order = order;
		this.userRepository = queryRunner.manager.getCustomRepository(UserRepository);
		this.userStockRepository = queryRunner.manager.getCustomRepository(UserStockRepository);
		this.askOrderRepository = queryRunner.manager.getCustomRepository(AskOrderRepository);
		this.bidOrderRepository = queryRunner.manager.getCustomRepository(BidOrderRepository);
	}

	public async updateUser(): Promise<void> {
		if (this.type === ORDERTYPE.BID) {
			const payout: number = this.order.price * this.order.amount;
			await this.userRepository.updateBalance(this.userId, payout * -1);
		}
		if (this.type === ORDERTYPE.ASK) {
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

	public async removeOrder(): Promise<void> {
		if (this.type === ORDERTYPE.ASK) await this.askOrderRepository.removeOrderOCC(this.order);
		else if (this.type === ORDERTYPE.BID) await this.bidOrderRepository.removeOrderOCC(this.order);
	}
}
