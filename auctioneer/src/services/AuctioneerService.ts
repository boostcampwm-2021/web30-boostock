/* eslint-disable class-methods-use-this */
import { getConnection } from 'typeorm';
import {
	StockRepository,
	UserRepository,
	UserStockRepository,
	AskOrderRepository,
	ChartRepository,
	BidOrderRepository,
} from '@repositories/index';
import { AskOrder, BidOrder } from '@models/index';
import { OrderError, OrderErrorMessage } from '@errors/index';
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
			const stockRepository = queryRunner.manager.getCustomRepository(StockRepository);
			const userRepository = queryRunner.manager.getCustomRepository(UserRepository);
			const userStockRepository = queryRunner.manager.getCustomRepository(UserStockRepository);
			const askOrderRepository = queryRunner.manager.getCustomRepository(AskOrderRepository);
			const bidOrderRepository = queryRunner.manager.getCustomRepository(BidOrderRepository);
			const chartRepository = queryRunner.manager.getCustomRepository(ChartRepository);

			const task = new BidAskTransaction(
				stockRepository,
				userRepository,
				userStockRepository,
				askOrderRepository,
				bidOrderRepository,
				chartRepository,
			);

			const [bidOrder, askOrder]: [BidOrder, AskOrder] = await Promise.all([
				bidOrderRepository.readByCode(code),
				askOrderRepository.readByCode(code),
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
				const user = await userRepository.readByIdLock(askOrder.userId, 'pessimistic_write');
				askUser = user;
				bidUser = user;
			} else {
				const users = await userRepository.readAskBidByIdLock(askOrder.userId, bidOrder.userId, 'pessimistic_write');
				askUser = users.find((user) => user.userId === askOrder.userId);
				bidUser = users.find((user) => user.userId === bidOrder.userId);
			}
			if (askUser === undefined || bidUser === undefined) throw new OrderError(OrderErrorMessage.NO_ORDERS_AVAILABLE);

			await Promise.all([
				task.bidUserProcess(bidUser, bidOrder),
				task.askUserProcess(askUser),
				task.bidOrderProcess(bidOrder),
				task.askOrderProcess(askOrder),
				task.chartProcess(),
			]);

			await queryRunner.commitTransaction();
			await task.logProcess();
			result = true;
		} catch (err) {
			await queryRunner.rollbackTransaction();
			result = false;
		} finally {
			await queryRunner.release();
		}
		return result;
	}
}
