import fetch from 'node-fetch';
import { Stock, User, UserStock, Order, OrderStatus, Transaction, Chart } from '@models/index';
import { StockRepository, UserRepository, UserStockRepository, OrderRepository, ChartRepository } from '@repositories/index';

export interface ITransactionLog {
	code: string;
	price: number;
	amount: number;
	stockId?: number;
	bidUser?: number;
	askUser?: number;
	createdAt?: number;
}

export interface IBidAskTransaction {
	StockRepositoryRunner: StockRepository;
	UserRepositoryRunner: UserRepository;
	UserStockRepositoryRunner: UserStockRepository;
	OrderRepositoryRunner: OrderRepository;
	ChartRepositoryRunner: ChartRepository;
	transactionLog: ITransactionLog;
}

export default class BidAskTransaction implements IBidAskTransaction {
	StockRepositoryRunner: StockRepository;

	UserRepositoryRunner: UserRepository;

	UserStockRepositoryRunner: UserStockRepository;

	OrderRepositoryRunner: OrderRepository;

	ChartRepositoryRunner: ChartRepository;

	transactionLog: ITransactionLog;

	constructor(
		StockRepositoryRunner: StockRepository,
		UserRepositoryRunner: UserRepository,
		UserStockRepositoryRunner: UserStockRepository,
		OrderRepositoryRunner: OrderRepository,
		ChartRepositoryRunner: ChartRepository,
	) {
		this.StockRepositoryRunner = StockRepositoryRunner;
		this.UserRepositoryRunner = UserRepositoryRunner;
		this.UserStockRepositoryRunner = UserStockRepositoryRunner;
		this.OrderRepositoryRunner = OrderRepositoryRunner;
		this.ChartRepositoryRunner = ChartRepositoryRunner;
	}

	init(transactionLog: ITransactionLog): BidAskTransaction {
		this.transactionLog = transactionLog;
		return this;
	}

	async askOrderProcess(askUser: User, askUserStock: UserStock | undefined, askOrder: Order): Promise<void | Error> {
		this.transactionLog.askUser = askUser.userId;
		if (askUserStock === undefined) {
			const newUserStock = this.UserStockRepositoryRunner.create({
				userId: askOrder.userId,
				stockId: askOrder.stockId,
				amount: this.transactionLog.amount,
				average: askOrder.price,
			});
			this.UserStockRepositoryRunner.insert(newUserStock);
		} else {
			askUserStock.amount += this.transactionLog.amount;
			await this.UserStockRepositoryRunner.save(askUserStock);
		}
		// 매수주문이랑 실제거래가가 차이있을 때 잔돈 반환하는 로직
		askUser.balance += (askOrder.price - this.transactionLog.price) * this.transactionLog.amount;
		await this.UserRepositoryRunner.save(askUser);

		askOrder.amount -= this.transactionLog.amount;
		if (askOrder.amount === 0) askOrder.status = OrderStatus.FINISHED;
		await this.OrderRepositoryRunner.save(askOrder);
	}

	async bidOrderProcess(bidUser: User, bidUserStock: UserStock | undefined, bidOrder: Order): Promise<void | Error> {
		this.transactionLog.bidUser = bidUser.userId;
		this.transactionLog.stockId = bidOrder.stockId;
		bidUser.balance += this.transactionLog.amount * this.transactionLog.price;
		await this.UserRepositoryRunner.save(bidUser);

		bidOrder.amount -= this.transactionLog.amount;
		if (bidOrder.amount === 0) bidOrder.status = OrderStatus.FINISHED;
		await this.OrderRepositoryRunner.save(bidOrder);
	}

	async noticeProcess(stock: Stock): Promise<void | Error> {
		stock.price = this.transactionLog.price;
		await this.StockRepositoryRunner.save(stock);

		const charts = await this.ChartRepositoryRunner.find({
			where: {
				stockId: this.transactionLog.stockId,
			},
		});

		const updatedCharts = charts.map((chart: Chart) => {
			if (chart.priceStart === 0) {
				chart.priceStart = this.transactionLog.price;
			}

			chart.priceEnd = this.transactionLog.price;
			chart.priceHigh = Math.max(chart.priceHigh, this.transactionLog.price);
			chart.priceLow = Math.min(chart.priceHigh, this.transactionLog.price);
			chart.amount += this.transactionLog.amount;
			chart.amount += this.transactionLog.price * this.transactionLog.amount;
			return chart;
		});

		updatedCharts.forEach(async (chart: Chart) => {
			await this.ChartRepositoryRunner.update(chart.chartId, chart);
		});

		const transaction = new Transaction({
			bidUserId: this.transactionLog.bidUser,
			askUserId: this.transactionLog.askUser,
			stockCode: this.transactionLog.code,
			amount: this.transactionLog.amount,
			price: this.transactionLog.price,
			createdAt: new Date(),
		});

		transaction.save((err, document) => {
			if (err) throw new Error('오류났어요 롤백해주세요');

			fetch(`${process.env.API_SERVER_URL}/api/stock/conclusion`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					match: {
						id: document.id,
						code: this.transactionLog.code,
						price: this.transactionLog.price,
						amount: this.transactionLog.amount,
						createdAt: new Date(),
					},
					currentChart: updatedCharts,
				}),
			});
		});
	}
}
