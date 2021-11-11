import { atom } from 'recoil';

export interface IStockListItem {
	stockId: number;
	code: string;
	nameKorean: string;
	nameEnglish: string;
	price: number;
	previousClose: number;
	unit: number;
}

const stockListAtom = atom<IStockListItem[]>({
	key: 'stockListAtom',
	default: [],
});

export default stockListAtom;
