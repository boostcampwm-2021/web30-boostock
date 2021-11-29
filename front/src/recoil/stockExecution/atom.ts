import { atom } from 'recoil';

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

const stockExecutionAtom = atom<IStockExecutionInfo>({
	key: 'stockExecutionAtom',
	default: {
		stockCode: '',
		executions: [],
	},
});

export default stockExecutionAtom;
