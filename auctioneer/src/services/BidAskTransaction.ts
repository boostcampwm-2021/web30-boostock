/* eslint-disable no-param-reassign */
import fetch from 'node-fetch';
import { User, AskOrder, TransactionLog, Chart } from '@models/index';
import {
	StockRepository,
	UserRepository,
	UserStockRepository,
	AskOrderRepository,
	ChartRepository,
	BidOrderRepository,
} from '@repositories/index';
import { DBError, DBErrorMessage } from '@errors/index';

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

	askOrderRepository: AskOrderRepository;

	bidOrderRepository: BidOrderRepository;

	chartRepository: ChartRepository;

	TransactionInfo: ITransactionInfo;

	updatedCharts: Chart[];

	constructor(
		stockRepository: StockRepository,
		userRepository: UserRepository,
		userStockRepository: UserStockRepository,
		askOrderRepository: AskOrderRepository,
		bidOrderRepository: BidOrderRepository,
		chartRepository: ChartRepository,
	) {
		this.stockRepository = stockRepository;
		this.userRepository = userRepository;
		this.userStockRepository = userStockRepository;
		this.askOrderRepository = askOrderRepository;
		this.bidOrderRepository = bidOrderRepository;
		this.chartRepository = chartRepository;
	}

	init(TransactionInfo: ITransactionInfo): BidAskTransaction {
		this.TransactionInfo = TransactionInfo;
		return this;
	}

	async askUserProcess(askUser: User): Promise<void> {
		await this.userRepository.updateBalance(askUser.userId, this.TransactionInfo.amount * this.TransactionInfo.price);
	}

	async bidUserProcess(bidUser: User, bidOrder: AskOrder): Promise<void> {
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
			await this.userStockRepository.updateQueryRunner(bidUserStock);
		} else {
			await this.userStockRepository.insertQueryRunner({
				userId: bidUser.userId,
				stockId: bidOrder.stockId,
				amount: this.TransactionInfo.amount,
				average: bidOrder.price,
			});
		}
	}

	async askOrderProcess(askOrder: AskOrder): Promise<void> {
		if (askOrder.amount === this.TransactionInfo.amount) await this.askOrderRepository.removeOrderOCC(askOrder);
		else await this.askOrderRepository.decreaseAmountOCC(askOrder, this.TransactionInfo.amount);
	}

	async bidOrderProcess(bidOrder: AskOrder): Promise<void> {
		if (bidOrder.amount === this.TransactionInfo.amount) await this.bidOrderRepository.removeOrderOCC(bidOrder);
		else await this.bidOrderRepository.decreaseAmountOCC(bidOrder, this.TransactionInfo.amount);
	}

	async chartProcess(): Promise<void> {
		const charts = await this.chartRepository.readByStockIdLock(this.TransactionInfo.stockId, 'pessimistic_write');

		await Promise.all(
			charts.map((chart: Chart) =>
				this.chartRepository.updateChart(chart, this.TransactionInfo.price, this.TransactionInfo.amount),
			),
		);
		this.updatedCharts = await this.chartRepository.readByStockIdLock(this.TransactionInfo.stockId, 'pessimistic_read');
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
			if (err) throw new DBError(DBErrorMessage.UPDATE_FAIL);

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
