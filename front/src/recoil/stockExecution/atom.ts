import { atom } from 'recoil';

export interface IStockExecutionItem {
	timestamp: number;
	price: number;
	volume: number;
	amount: number;
}

const stockExecutionAtom = atom<IStockExecutionItem[]>({
	key: 'stockExecutionAtom',
	default: [
		{
			timestamp: 0,
			price: 0,
			volume: 0,
			amount: 0,
		},
	],
});

export default stockExecutionAtom;
