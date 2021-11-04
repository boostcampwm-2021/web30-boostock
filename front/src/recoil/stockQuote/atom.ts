import { atom } from 'recoil';

export enum IStockQuoteType {
	SELL = 0,
	BUY = 1,
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
			price: 0,
			type: IStockQuoteType.SELL,
			volume: 0,
		},
	],
});

export default stockQuoteAtom;
