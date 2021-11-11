import { atom } from 'recoil';

export interface IStockChartItem {
	chartId: number;
	type: number;
	priceBefore: number;
	priceStart: number;
	priceEnd: number;
	priceLow: number;
	priceHigh: number;
	volume: number;
	amount: number;
}

export interface IStockListItem {
	stockId: number;
	code: string;
	nameKorean: string;
	nameEnglish: string;
	price: number;
	previousClose: number;
	unit: number;
	charts: IStockChartItem[];
}

const stockListAtom = atom<IStockListItem[]>({
	key: 'stockListAtom',
	default: [],
});

export default stockListAtom;
