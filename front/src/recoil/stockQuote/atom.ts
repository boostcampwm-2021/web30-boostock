import { atom } from 'recoil';

export interface IStockQuoteItem {
	price: number;
	amount: number;
}

const stockQuoteAtom = atom<IStockQuoteItem[]>({
	key: 'stockQuoteAtom',
	default: [
		{
			price: 0,
			amount: 0,
		},
	],
});

export default stockQuoteAtom;
