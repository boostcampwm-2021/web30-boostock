/* eslint-disable no-param-reassign */
import fetch from 'node-fetch';
import { User, Order, TransactionLog, Chart } from '@models/index';
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
function refundBetweenDepositTransacionAmount(deposit: number, price: number, amount: number) {
	return (deposit - price) * amount;
}

export default class BidAskTransaction {
	stockRepository: StockRepository;

	userRepository: UserRepository;

	userStockRepository: UserStockRepository;

	orderRepository: OrderRepository;

	chartRepository: ChartRepository;

	TransactionInfo: ITransactionInfo;

	updatedCharts: Chart[];

	constructor(
		stockRepository: StockRepository,
		userRepository: UserRepository,
		userStockRepository: UserStockRepository,
		orderRepository: OrderRepository,
		chartRepository: ChartRepository,
	) {
		this.stockRepository = stockRepository;
		this.userRepository = userRepository;
		this.userStockRepository = userStockRepository;
		this.orderRepository = orderRepository;
		this.chartRepository = chartRepository;
	}

	init(TransactionInfo: ITransactionInfo): BidAskTransaction {
		this.TransactionInfo = TransactionInfo;
		return this;
	}

	async askUserProcess(askUser: User): Promise<void> {
		await this.userRepository.updateBalance(askUser.userId, this.TransactionInfo.amount * this.TransactionInfo.price);
	}

	async bidUserProcess(bidUser: User, bidOrder: Order): Promise<void> {
		const refund = refundBetweenDepositTransacionAmount(
			bidOrder.price,
			this.TransactionInfo.price,
			this.TransactionInfo.amount,
		);
		this.userRepository.updateBalance(bidUser.userId, refund);

		let bidUserStock = await this.userStockRepository.read(bidUser.userId, this.TransactionInfo.stockId);

		if (bidUserStock) {
			bidUserStock = await this.userStockRepository.readLock(bidUserStock.userStockId, 'pessimistic_write');
			bidUserStock.amount += this.TransactionInfo.amount;
			bidUserStock.average = getAveragePrice(
				bidUserStock.amount,
				bidUserStock.average,
				this.TransactionInfo.amount,
				this.TransactionInfo.price,
			);
			await this.userStockRepository.update(bidUserStock.userStockId, bidUserStock);
		} else {
			bidUserStock = this.userStockRepository.create({
				userId: bidUser.userId,
				stockId: bidOrder.stockId,
				amount: this.TransactionInfo.amount,
				average: bidOrder.price,
			});
			await this.userStockRepository.save(bidUserStock);
		}
	}

	async askOrderProcess(askOrder: Order): Promise<void> {
		if (askOrder.amount === this.TransactionInfo.amount) await this.orderRepository.removeOrderOCC(askOrder);
		else await this.orderRepository.decreaseAmountOCC(askOrder, this.TransactionInfo.amount);
	}

	async bidOrderProcess(bidOrder: Order): Promise<void> {
		if (bidOrder.amount === this.TransactionInfo.amount) await this.orderRepository.removeOrderOCC(bidOrder);
		else await this.orderRepository.decreaseAmountOCC(bidOrder, this.TransactionInfo.amount);
	}

	async chartProcess(): Promise<void> {
		const charts = await this.chartRepository.readByStockIdLock(this.TransactionInfo.stockId, 'pessimistic_write');

		await Promise.all(
			charts.map((chart: Chart) =>
				this.chartRepository.updateChart(chart, this.TransactionInfo.price, this.TransactionInfo.amount),
			),
		);
		this.updatedCharts = await this.chartRepository.readByStockIdLock(this.TransactionInfo.stockId, 'pessimistic_write');
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
