import { atom } from 'recoil';

export interface IStockListItem {
	id: number;
	name: string;
	currentPrice: number;
	highPrice: number;
	lowPrice: number;
	previousClosingPrice: number;
	tradingVolume: number;
	tradingAmount: number;
}

const stockListAtom = atom<IStockListItem[]>({
	key: 'stockListAtom',
	default: [
		{
			id: 0,
			name: '',
			currentPrice: 0,
			highPrice: 0,
			lowPrice: 0,
			previousClosingPrice: 0,
			tradingVolume: 0,
			tradingAmount: 0,
		},
	],
});

export default stockListAtom;
