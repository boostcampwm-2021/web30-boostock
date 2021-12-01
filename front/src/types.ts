export enum ORDER_TYPE {
	ASK = 1,
	BID = 2,
}

export enum BALANCE_TYPE {
	DEPOSIT = 1,
	WITHDRAW = 2,
}

export enum STATUS_TYPE {
	PENDING = 1,
	PROCEEDING = 2,
	FINISHED = 3,
	CANCELED = 4,
}

export type Theme = 'light' | 'dark';

export interface IChartItem {
	createdAt: number;
	priceStart: number;
	priceEnd: number;
	priceLow: number;
	priceHigh: number;
	amount: number;
}

export interface IStockChartItem {
	chartId: number;
	type: number;
	priceBefore: number;
	priceStart: number;
	priceEnd: number;
	priceLow: number;
	priceHigh: number;
	volume: number;
	amount: number;
}

export interface IStockListItem {
	stockId: number;
	code: string;
	nameKorean: string;
	nameEnglish: string;
	price: number;
	previousClose: number;
	unit: number;
	charts: IStockChartItem[];
}

export interface IDailyLog {
	_id: string;
	priceEnd: number;
	amount: number;
	createdAt: number;
}

export interface IStockExecutionItem {
	timestamp: number;
	price: number;
	volume: number;
	amount: number;
	stockCode: string;
	id: string;
}

export interface IStockExecutionInfo {
	stockCode: string;
	executions: IStockExecutionItem[];
}

export interface IUser {
	username: string;
	email: string;
	isLoggedIn: boolean;
	theme: Theme;
}

export interface IAskOrderItem {
	type: ORDER_TYPE.ASK;
	price: number;
	amount: number;
}

export interface IBidOrderItem {
	type: ORDER_TYPE.BID;
	price: number;
	amount: number;
}

export interface IHoldStockItem {
	amount: number;
	average: number;
	code: string;
	nameEnglish: string;
	nameKorean: string;
}

export interface IUserHoldItem {
	stockCode: string;
	stockName: string;
	holdAmount: number;
	averageAskPrice: number;
	totalAskPrice: number;
	totalValuationPrice: number;
	totalValuationProfit: number;
}
