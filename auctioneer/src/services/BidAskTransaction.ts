/* eslint-disable no-param-reassign */
import fetch from 'node-fetch';
import { Stock, User, UserStock, Order, TransactionLog, Chart } from '@models/index';
import { StockRepository, UserRepository, UserStockRepository, OrderRepository, ChartRepository } from '@repositories/index';
import { CommonError, CommonErrorMessage } from '@errors/index';

export interface ITransactionInfo {
	code: string;
	price: number;
	amount: number;
	stockId: number;
	bidUser: number;
	askUser: number;
	createdAt: number;
}

function getAveragePrice(holdAmount: number, holdAverage: number, newAmount: number, newPrice: number): number {
	return (holdAmount * holdAverage + newAmount * newPrice) / (holdAmount + newAmount);
}

export default class BidAskTransaction {
	StockRepositoryRunner: StockRepository;

	UserRepositoryRunner: UserRepository;

	UserStockRepositoryRunner: UserStockRepository;

	OrderRepositoryRunner: OrderRepository;

	ChartRepositoryRunner: ChartRepository;

	TransactionInfo: ITransactionInfo;

	updatedCharts: Chart[];

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

	init(TransactionInfo: ITransactionInfo): BidAskTransaction {
		this.TransactionInfo = TransactionInfo;
		return this;
	}

	async askOrderProcess(askUser: User, askOrder: Order): Promise<void | Error> {
		askUser.balance += this.TransactionInfo.amount * this.TransactionInfo.price;
		await this.UserRepositoryRunner.save(askUser);

		if (askOrder.amount === this.TransactionInfo.amount) {
			await this.OrderRepositoryRunner.removeOrder(askOrder);
		} else {
			await this.OrderRepositoryRunner.updateOrder(askOrder, this.TransactionInfo.amount);
		}
	}

	async bidOrderProcess(bidUser: User, bidUserStock: UserStock | undefined, bidOrder: Order): Promise<void | Error> {
		this.TransactionInfo.bidUser = bidUser.userId;
		this.TransactionInfo.stockId = bidOrder.stockId;
		// 매수주문이랑 실제거래가가 차이있을 때 잔돈 반환하는 로직
		bidUser.balance += (bidOrder.price - this.TransactionInfo.price) * this.TransactionInfo.amount;
		await this.UserRepositoryRunner.save(bidUser);

		if (bidUserStock === undefined) {
			const newUserStock = this.UserStockRepositoryRunner.create({
				user: bidUser,
				stock: bidOrder,
				amount: this.TransactionInfo.amount,
				average: bidOrder.price,
			});
			this.UserStockRepositoryRunner.insert(newUserStock);
		} else {
			bidUserStock.amount += this.TransactionInfo.amount;
			bidUserStock.average = getAveragePrice(
				bidUserStock.amount,
				bidUserStock.average,
				this.TransactionInfo.amount,
				this.TransactionInfo.price,
			);
			await this.UserStockRepositoryRunner.save(bidUserStock);
		}

		if (bidOrder.amount === this.TransactionInfo.amount) {
			await this.OrderRepositoryRunner.removeOrder(bidOrder);
		} else {
			await this.OrderRepositoryRunner.updateOrder(bidOrder, this.TransactionInfo.amount);
		}
	}

	async chartProcess(stock: Stock): Promise<void | Error> {
		stock.price = this.TransactionInfo.price;
		await this.StockRepositoryRunner.save(stock);

		const charts = await this.ChartRepositoryRunner.find({
			where: {
				stock,
			},
		});

		this.updatedCharts = charts.map((chart: Chart) => {
			chart.priceEnd = this.TransactionInfo.price;
			if (chart.priceStart === 0) {
				chart.priceStart = this.TransactionInfo.price;
				chart.priceHigh = this.TransactionInfo.price;
				chart.priceLow = this.TransactionInfo.price;
			} else {
				chart.priceHigh = Math.max(chart.priceHigh, this.TransactionInfo.price);
				chart.priceLow = Math.min(chart.priceLow, this.TransactionInfo.price);
			}
			chart.amount += this.TransactionInfo.amount;
			chart.volume += this.TransactionInfo.price * this.TransactionInfo.amount;
			return chart;
		});

		await Promise.all(this.updatedCharts.map((chart: Chart) => this.ChartRepositoryRunner.update(chart.chartId, chart)));
	}

	async logProcess(): Promise<void> {
		const transaction = new TransactionLog({
			bidUserId: this.TransactionInfo.bidUser,
			askUserId: this.TransactionInfo.askUser,
			stockCode: this.TransactionInfo.code,
			amount: this.TransactionInfo.amount,
			price: this.TransactionInfo.price,
			createdAt: new Date().getTime(),
		});

		transaction.save((err, document) => {
			if (err) throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);

			fetch(`${process.env.API_SERVER_URL}/api/stock/conclusion`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					match: {
						id: document.id,
						stockId: this.TransactionInfo.stockId,
						bidUser: this.TransactionInfo.bidUser,
						askUser: this.TransactionInfo.askUser,
						code: this.TransactionInfo.code,
						price: this.TransactionInfo.price,
						amount: this.TransactionInfo.amount,
						createdAt: this.TransactionInfo.createdAt,
					},
					currentChart: this.updatedCharts,
				}),
			});
		});
	}
}
