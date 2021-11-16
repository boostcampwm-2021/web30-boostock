import { atom } from 'recoil';

export enum IStockQuoteType {
	SELL = 1,
	BUY = 2,
}
export interface IStockQuoteItem {
	type: IStockQuoteType;
	price: number;
	amount: number;
}

const stockQuoteAtom = atom<IStockQuoteItem[]>({
	key: 'stockQuoteAtom',
	default: [],
});

export default stockQuoteAtom;
