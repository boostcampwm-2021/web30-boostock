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
			id: 1,
			name: '호눅스코인',
			currentPrice: 12345,
			highPrice: 12345,
			lowPrice: 1234,
			previousClosingPrice: 1234,
			tradingVolume: 1234,
			tradingAmount: 1234,
		},
		{
			id: 2,
			name: '크롱코인',
			currentPrice: 1234,
			highPrice: 12345,
			lowPrice: 1234,
			previousClosingPrice: 12345,
			tradingVolume: 1234567,
			tradingAmount: 1234567,
		},
		{
			id: 3,
			name: 'JK코인',
			currentPrice: 1234,
			highPrice: 12345,
			lowPrice: 123,
			previousClosingPrice: 1234,
			tradingVolume: 123456,
			tradingAmount: 123456,
		},
	],
});

export default stockListAtom;
