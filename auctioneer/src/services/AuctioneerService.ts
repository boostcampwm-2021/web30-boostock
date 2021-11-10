/* eslint-disable class-methods-use-this */
import { EntityManager, getConnection } from 'typeorm';
import {
	UserRepository,
	UserStockRepository,
	OrderRepository,
	ChartRepository,
} from '@repositories/index';
import { User, UserStock, Stock, Order, OrderType, Chart } from '@models/index';
import { CommonError, CommonErrorMessage } from '@services/errors/index';
import { transaction } from '@helper/tools';
import BidTransaction, { ITransactionLog } from './BidTransaction';

export default class AuctioneerService {
	static instance: AuctioneerService | null = null;

	constructor() {
		if (AuctioneerService.instance) return AuctioneerService.instance;
		AuctioneerService.instance = this;
	}

	public async bid(stockId: number) {
		const connection = getConnection();
		const queryRunner = connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const OrderRepositoryRunner =
				queryRunner.manager.getCustomRepository(OrderRepository);
			const UserStockRepositoryRunner =
				queryRunner.manager.getCustomRepository(UserStockRepository);
			const UserRepositoryRunner =
				queryRunner.manager.getCustomRepository(UserRepository);
			const ChartRepositoryRunner =
				queryRunner.manager.getCustomRepository(ChartRepository);

			const orderBid = await OrderRepositoryRunner.readOrderByAsc(
				stockId,
				OrderType.SELL,
			);
			if (orderBid === undefined)
				throw new Error('orderBid가 없는 말도안되는 에러');

			const bidUser = await UserRepositoryRunner.readUserById(
				orderBid.userId,
			);

			if (bidUser === undefined)
				throw new Error('bidUser가 없는 말도안되는 에러');

			const process = new BidTransaction(
				OrderRepositoryRunner,
				UserRepositoryRunner,
				UserStockRepositoryRunner,
				ChartRepositoryRunner,
				orderBid,
				bidUser,
			);
			/* eslint-disable no-await-in-loop */
			while (orderBid && orderBid.amount) {
				const orderAsk = await OrderRepositoryRunner.readOrderByDesc(
					stockId,
					OrderType.BUY,
				);
				if (!orderAsk || orderBid.price > orderAsk.price) {
					console.log('맞는 주문이 없음 ');
					break;
				}

				const transactionLog: ITransactionLog = {
					stockId: orderBid.stockId,
					bidUserId: orderBid.userId,
					askUserId: orderAsk.userId,
					price: orderAsk.price,
					amount: Math.min(orderBid.amount, orderAsk.amount),
					createdAt: new Date().getTime(),
				};

				// 주문이 체결될 경우
				// 매수주문자의 보유 수량을 반영한다. (보유수량+ 주문수량-)
				// bid주문 = 30주, 가격 300원 , ask주문 = 가격 310원, 10주
				const askUser = await UserRepositoryRunner.readUserById(
					orderAsk.userId,
				);

				if (!askUser) break;
				const askUserStock = askUser.stocks.find(
					(stock: UserStock) => stock.stockId === stockId,
				);

				await process
					.init(transactionLog)
					.askProcess(askUser, askUserStock, orderAsk)
					.bidProcess()
					.orderProcess()
					.candleProcess();
				// - 매도주문자의 잔고를 반영한다.
				// bidUser.balance += transactionLog.price * transactionLog.amount;

				// - 주문의 주문 수량을 반영한다.
				// orderBid.amount -= transactionLog.amount;
				// - mysql의 거래 종목(일봉 둘 다 일분봉)에 거래량, 거래금액을 반영한다.

				// - mongoDB에 거래체결을 반영한다.
				break;
			}

			await UserRepositoryRunner.save(bidUser);
			await OrderRepositoryRunner.save(orderBid);
			queryRunner.commitTransaction();
		} catch (err) {
			console.log(err);
			queryRunner.rollbackTransaction();
		} finally {
			queryRunner.release();
		}
	}

	public ask(entityManager: EntityManager, stockId: number) {
		// 1. 가장 낮은 가격의 매도 주문 1개를 가져온다.
		// 2. 가장 높은 가격의 매수 주문 1개를 가져온다. (반복)
	}
}
