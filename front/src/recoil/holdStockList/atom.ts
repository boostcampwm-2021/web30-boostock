import { atom } from 'recoil';

export interface IHoldStockItem {
	code: string;
}

export interface IHoldStockListItem {
	holdStockList: IHoldStockItem[];
}

const holdStockListAtom = atom<IHoldStockItem[]>({
	key: 'holdStockListAtom',
	default: [],
});

export default holdStockListAtom;
