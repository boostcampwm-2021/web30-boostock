import { atom } from 'recoil';

export enum IStockQuoteType {
	SELL = 1,
	BUY = 2,
}
export interface IStockQuoteItem {
	type: IStockQuoteType;
	price: number;
	volume: number;
}

const stockQuoteAtom = atom<IStockQuoteItem[]>({
	key: 'stockQuoteAtom',
	default: [
		{
			price: 71600,
			volume: 160230,
			type: IStockQuoteType.SELL,
		},
		{
			price: 71500,
			volume: 194556,
			type: IStockQuoteType.SELL,
		},
		{
			price: 71400,
			volume: 118431,
			type: IStockQuoteType.SELL,
		},
		{
			price: 71300,
			volume: 42369,
			type: IStockQuoteType.SELL,
		},
		{
			price: 71200,
			volume: 69301,
			type: IStockQuoteType.SELL,
		},
		{
			price: 71100,
			volume: 152966,
			type: IStockQuoteType.SELL,
		},
		{
			price: 71000,
			volume: 164839,
			type: IStockQuoteType.SELL,
		},
		{
			price: 70900,
			volume: 49468,
			type: IStockQuoteType.SELL,
		},
		{
			price: 70800,
			volume: 49461,
			type: IStockQuoteType.SELL,
		},
		{
			price: 70700,
			volume: 17713,
			type: IStockQuoteType.SELL,
		},
		{
			price: 70600,
			volume: 84610,
			type: IStockQuoteType.BUY,
		},
		{
			price: 70500,
			volume: 215110,
			type: IStockQuoteType.BUY,
		},
		{
			price: 70400,
			volume: 132741,
			type: IStockQuoteType.BUY,
		},
		{
			price: 70300,
			volume: 111461,
			type: IStockQuoteType.BUY,
		},
		{
			price: 70200,
			volume: 91219,
			type: IStockQuoteType.BUY,
		},
		{
			price: 70100,
			volume: 92743,
			type: IStockQuoteType.BUY,
		},
		{
			price: 70000,
			volume: 602644,
			type: IStockQuoteType.BUY,
		},
		{
			price: 69900,
			volume: 77021,
			type: IStockQuoteType.BUY,
		},
		{
			price: 69800,
			volume: 70749,
			type: IStockQuoteType.BUY,
		},
		{
			price: 69700,
			volume: 23517,
			type: IStockQuoteType.BUY,
		},
	],
});

export default stockQuoteAtom;
