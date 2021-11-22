/* eslint-disable class-methods-use-this */
import { getConnection } from 'typeorm';
import { StockRepository, UserRepository, UserStockRepository, OrderRepository, ChartRepository } from '@repositories/index';
import { Stock, Order } from '@models/index';
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
			const StockRepositoryRunner = queryRunner.manager.getCustomRepository(StockRepository);
			const UserRepositoryRunner = queryRunner.manager.getCustomRepository(UserRepository);
			const UserStockRepositoryRunner = queryRunner.manager.getCustomRepository(UserStockRepository);
			const OrderRepositoryRunner = queryRunner.manager.getCustomRepository(OrderRepository);
			const ChartRepositoryRunner = queryRunner.manager.getCustomRepository(ChartRepository);

			const [stock, orderBid, orderAsk]: [Stock | undefined, Order | undefined, Order | undefined] = await Promise.all([
				StockRepositoryRunner.readStockByCode(code),
				OrderRepositoryRunner.readBidOrderByCode(code),
				OrderRepositoryRunner.readAskOrderByCode(code),
			]);
			if (stock === undefined || orderAsk === undefined || orderBid === undefined || orderAsk.price > orderBid.price)
				throw new OrderError(OrderErrorMessage.NO_ORDERS_AVAILABLE);

			const [askUser, bidUser] = await Promise.all([
				UserRepositoryRunner.readUserById(orderAsk.userId),
				UserRepositoryRunner.readUserById(orderBid.userId),
			]);
			if (askUser === undefined || bidUser === undefined) throw new OrderError(OrderErrorMessage.NO_ORDERS_AVAILABLE);
			const bidUserStock = await UserStockRepositoryRunner.readUserStockByCode(bidUser.userId, code);

			const task = new BidAskTransaction(
				StockRepositoryRunner,
				UserRepositoryRunner,
				UserStockRepositoryRunner,
				OrderRepositoryRunner,
				ChartRepositoryRunner,
			);

			task.init({
				code,
				price: orderAsk.createdAt < orderBid.createdAt ? orderAsk.price : orderBid.price,
				amount: Math.min(orderBid.amount, orderAsk.amount),
				createdAt: new Date(),
				askUser: orderAsk.userId,
				bidUser: orderBid.userId,
				stockId: orderAsk.stockId,
			});

			await Promise.all([
				task.bidOrderProcess(bidUser, bidUserStock, orderBid),
				task.askOrderProcess(askUser, orderAsk),
				task.chartProcess(stock),
			]);
			await task.logProcess();

			queryRunner.commitTransaction();
			result = true;
		} catch (err) {
			queryRunner.rollbackTransaction();
			result = false;
		} finally {
			queryRunner.release();
		}
		return result;
	}
}
