import { atom } from 'recoil';

export interface IStockExecutionItem {
	timestamp: string;
	price: number;
	volume: number;
	amount: number;
	type: string;
	id: number;
}

const stockExecutionAtom = atom<IStockExecutionItem[]>({
	key: 'stockExecutionAtom',
	default: [
		{
			timestamp: new Date('2021-11-04 14:53:00').toString(),
			price: 74211000,
			volume: 20,
			amount: 74211000 * 20,
			type: 'bid',
			id: 0,
		},
		{
			timestamp: new Date('2021-11-04 14:53:00').toString(),
			price: 74211000,
			volume: 20,
			amount: 74211000 * 20,
			type: 'bid',
			id: 1,
		},
		{
			timestamp: new Date('2021-11-04 14:53:00').toString(),
			price: 74211000,
			volume: 20,
			amount: 74211000 * 20,
			type: 'bid',
			id: 2,
		},
		{
			timestamp: new Date('2021-11-04 14:53:00').toString(),
			price: 74211000,
			volume: 20,
			amount: 74211000 * 20,
			type: 'ask',
			id: 3,
		},
		{
			timestamp: new Date('2021-11-04 14:53:00').toString(),
			price: 74211000,
			volume: 20,
			amount: 74211000 * 20,
			type: 'bid',
			id: 4,
		},
	],
});

export default stockExecutionAtom;
