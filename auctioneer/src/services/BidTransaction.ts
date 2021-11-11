/* eslint-disable no-param-reassign */
import { User, UserStock, Order, Chart } from '@models/index';
import { UserRepository, UserStockRepository, OrderRepository, ChartRepository } from '@repositories/index';

export interface ITransactionLog {
	stockId: number;
	bidUserId: number;
	askUserId: number;
	price: number;
	amount: number;
	createdAt: number;
}

export interface IBidTransaction {
	OrderRepositoryRunner: OrderRepository;
	UserRepositoryRunner: UserRepository;
	UserStockRepositoryRunner: UserStockRepository;
	ChartRepositoryRunner: ChartRepository;
	orderBid: Order;
	bidUser: User;
	transactionLog: ITransactionLog;
}

export default class BidTransaction implements IBidTransaction {
	OrderRepositoryRunner;

	UserRepositoryRunner;

	UserStockRepositoryRunner;

	ChartRepositoryRunner;

	orderBid;

	transactionLog;

	bidUser;

	constructor(
		OrderRepositoryRunner: OrderRepository,
		UserRepositoryRunner: UserRepository,
		UserStockRepositoryRunner: UserStockRepository,
		ChartRepositoryRunner: ChartRepository,
		orderBid: Order,
		bidUser: User,
	) {
		this.OrderRepositoryRunner = OrderRepositoryRunner;
		this.UserRepositoryRunner = UserRepositoryRunner;
		this.UserStockRepositoryRunner = UserStockRepositoryRunner;
		this.ChartRepositoryRunner = ChartRepositoryRunner;
		this.orderBid = orderBid;
		this.bidUser = bidUser;
	}

	init(transactionLog: ITransactionLog): BidTransaction {
		this.transactionLog = transactionLog;
		return this;
	}

	askProcess(askUser: User, askUserStock: UserStock | undefined, orderAsk: Order): BidTransaction {
		if (askUserStock === undefined) {
			const newAskUserStock = this.UserStockRepositoryRunner.create({
				userId: orderAsk.userId,
				stockId: orderAsk.stockId,
				amount: this.transactionLog.amount,
				average: orderAsk.price,
			});
			console.log(newAskUserStock);
			this.UserStockRepositoryRunner.insert(newAskUserStock);
		} else {
			askUserStock.amount += this.transactionLog.amount;
			this.UserStockRepositoryRunner.updateUserStock(askUserStock);
		}
		askUser.balance += (this.transactionLog.price - orderAsk.price) * this.transactionLog.amount;
		this.UserRepositoryRunner.save(askUser);
		// this.UserRepositoryRunner.updateUser(askUser);
		return this;
	}

	bidProcess(): BidTransaction {
		this.bidUser.balance += this.transactionLog.price * this.transactionLog.amount;
		return this;
	}

	orderProcess(): BidTransaction {
		this.orderBid.amount -= this.transactionLog.amount;
		return this;
	}

	async candleProcess(): Promise<BidTransaction> {
		const charts = await this.ChartRepositoryRunner.find({
			where: {
				stockId: this.orderBid.stockId,
			},
		});
		console.log(':::::::::::::::::::', charts);
		/* eslint-disable no-param-reassign */
		charts
			.map((chart: Chart) => {
				if (chart.priceStart === 0) {
					chart.priceStart = this.transactionLog.price;
				}

				chart.priceEnd = this.transactionLog.price;
				chart.priceHigh = Math.max(chart.priceHigh, this.transactionLog.price);
				chart.priceLow = Math.min(chart.priceHigh, this.transactionLog.price);
				chart.amount += this.transactionLog.amount;
				chart.volume += this.transactionLog.price * this.transactionLog.amount;
				return chart;
			})
			.forEach((chart: Chart) => {
				this.ChartRepositoryRunner.update(chart.chartId, chart);
			});
		console.log(this.transactionLog);
		return this;
	}
}
