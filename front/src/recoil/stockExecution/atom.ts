import { atom } from 'recoil';

export interface IStockExecutionItem {
	timestamp: Date;
	price: number;
	volume: number;
	amount: number;
	id: string;
}

const stockExecutionAtom = atom<IStockExecutionItem[]>({
	key: 'stockExecutionAtom',
	default: [],
});

export default stockExecutionAtom;
