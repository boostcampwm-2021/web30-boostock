/* eslint-disable class-methods-use-this */
import { getConnection } from 'typeorm';
import { StockRepository, UserRepository, UserStockRepository, OrderRepository, ChartRepository } from '@repositories/index';
import { Order } from '@models/index';
import { OptimisticVersionError, OrderError, OrderErrorMessage } from '@errors/index';
import BidAskTransaction from './BidAskTransaction';

export default class AuctioneerService {
	static instance: AuctioneerService | null = null;

	constructor() {
		if (AuctioneerService.instance) return AuctioneerService.instance;
		AuctioneerService.instance = this;
	}

	public async bidAsk(code: string): Promise<boolean> {
		let result = false;
		const connection = getConnection();
		const queryRunner = connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const StockRepositoryRunner = queryRunner.manager.getCustomRepository(StockRepository);
			const UserRepositoryRunner = queryRunner.manager.getCustomRepository(UserRepository);
			const UserStockRepositoryRunner = queryRunner.manager.getCustomRepository(UserStockRepository);
			const OrderRepositoryRunner = queryRunner.manager.getCustomRepository(OrderRepository);
			const ChartRepositoryRunner = queryRunner.manager.getCustomRepository(ChartRepository);

			const task = new BidAskTransaction(
				StockRepositoryRunner,
				UserRepositoryRunner,
				UserStockRepositoryRunner,
				OrderRepositoryRunner,
				ChartRepositoryRunner,
			);

			const [bidOrder, askOrder]: Order[] = await Promise.all([
				OrderRepositoryRunner.readBidOrderByCode(code),
				OrderRepositoryRunner.readAskOrderByCode(code),
			]);
			if (askOrder.price > bidOrder.price) throw new OrderError(OrderErrorMessage.NO_ORDERS_AVAILABLE);

			task.init({
				code,
				price: askOrder.createdAt < bidOrder.createdAt ? askOrder.price : bidOrder.price,
				amount: Math.min(bidOrder.amount, askOrder.amount),
				createdAt: new Date().getTime(),
				askUser: askOrder.userId,
				bidUser: bidOrder.userId,
				stockId: askOrder.stockId,
			});

			let askUser;
			let bidUser;

			if (askOrder.userId === bidOrder.userId) {
				const user = await UserRepositoryRunner.readByIdLock(askOrder.userId, 'pessimistic_read');
				askUser = user;
				bidUser = user;
			} else {
				const users = await UserRepositoryRunner.readAskBidByIdLock(askOrder.userId, bidOrder.userId, 'pessimistic_read');
				askUser = users.find((user) => user.userId === askOrder.userId);
				bidUser = users.find((user) => user.userId === bidOrder.userId);
			}
			if (askUser === undefined || bidUser === undefined) throw new OrderError(OrderErrorMessage.NO_ORDERS_AVAILABLE);

			await Promise.all([
				task.bidUserProcess(bidUser, bidOrder),
				task.askUserProcess(askUser),
				task.askOrderProcess(askOrder),
				task.bidOrderProcess(bidOrder),
				task.chartProcess(),
			]);

			await queryRunner.commitTransaction();
			await task.logProcess();
			result = true;
		} catch (err) {
			if (err instanceof OptimisticVersionError) console.error(err);
			await queryRunner.rollbackTransaction();
			result = false;
		} finally {
			await queryRunner.release();
		}
		return result;
	}
}
