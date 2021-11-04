import { atom } from 'recoil';

export enum IStockQuoteType {
	SELL = 0,
	BUY = 1,
}
export interface IStockQuoteItem {
	id: number;
	type: IStockQuoteType;
	price: number;
	volume: number;
}

const stockQuoteAtom = atom<IStockQuoteItem[]>({
	key: 'stockQuoteAtom',
	default: [
		{
			id: 1,
			price: 71600,
			volume: 160230,
			type: IStockQuoteType.SELL,
		},
		{
			id: 2,
			price: 71500,
			volume: 194556,
			type: IStockQuoteType.SELL,
		},
		{
			id: 3,
			price: 71400,
			volume: 118431,
			type: IStockQuoteType.SELL,
		},
		{
			id: 4,
			price: 71300,
			volume: 42369,
			type: IStockQuoteType.SELL,
		},
		{
			id: 5,
			price: 71200,
			volume: 69301,
			type: IStockQuoteType.SELL,
		},
		{
			id: 6,
			price: 71100,
			volume: 152966,
			type: IStockQuoteType.SELL,
		},
		{
			id: 7,
			price: 71000,
			volume: 164839,
			type: IStockQuoteType.SELL,
		},
		{
			id: 8,
			price: 70900,
			volume: 49468,
			type: IStockQuoteType.SELL,
		},
		{
			id: 9,
			price: 70800,
			volume: 49461,
			type: IStockQuoteType.SELL,
		},
		{
			id: 10,
			price: 70700,
			volume: 17713,
			type: IStockQuoteType.SELL,
		},
		{
			id: 11,
			price: 70600,
			volume: 84610,
			type: IStockQuoteType.BUY,
		},
		{
			id: 12,
			price: 70500,
			volume: 215110,
			type: IStockQuoteType.BUY,
		},
		{
			id: 13,
			price: 70400,
			volume: 132741,
			type: IStockQuoteType.BUY,
		},
		{
			id: 14,
			price: 70300,
			volume: 111461,
			type: IStockQuoteType.BUY,
		},
		{
			id: 15,
			price: 70200,
			volume: 91219,
			type: IStockQuoteType.BUY,
		},
		{
			id: 16,
			price: 70100,
			volume: 92743,
			type: IStockQuoteType.BUY,
		},
		{
			id: 17,
			price: 70000,
			volume: 602644,
			type: IStockQuoteType.BUY,
		},
		{
			id: 18,
			price: 69900,
			volume: 77021,
			type: IStockQuoteType.BUY,
		},
		{
			id: 19,
			price: 69800,
			volume: 70749,
			type: IStockQuoteType.BUY,
		},
		{
			id: 20,
			price: 69700,
			volume: 23517,
			type: IStockQuoteType.BUY,
		},
	],
});

export default stockQuoteAtom;
