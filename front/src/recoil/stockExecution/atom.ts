import { atom } from 'recoil';
import { IStockExecutionInfo } from '@src/types';

const stockExecutionAtom = atom<IStockExecutionInfo>({
	key: 'stockExecutionAtom',
	default: {
		stockCode: '',
		executions: [],
	},
});

export default stockExecutionAtom;
