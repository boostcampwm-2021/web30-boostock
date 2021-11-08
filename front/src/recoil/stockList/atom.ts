import { atom } from 'recoil';

export interface IStockListItem {
	id: number;
	code: string;
	korean: string;
	english: string;
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
			code: 'honux',
			korean: '호눅스',
			english: 'honux',
			currentPrice: 12345,
			highPrice: 12345,
			lowPrice: 1234,
			previousClosingPrice: 1234,
			tradingVolume: 1234,
			tradingAmount: 1234,
		},
		{
			id: 2,
			code: 'crong',
			korean: '크롱',
			english: 'crong',
			currentPrice: 1234,
			highPrice: 12345,
			lowPrice: 1234,
			previousClosingPrice: 12345,
			tradingVolume: 1234567,
			tradingAmount: 1234567,
		},
		{
			id: 3,
			code: 'jk',
			korean: '제이케이',
			english: 'JK',
			currentPrice: 1234,
			highPrice: 12345,
			lowPrice: 123,
			previousClosingPrice: 1234,
			tradingVolume: 123456,
			tradingAmount: 123456,
		},
		{
			id: 4,
			code: 'ivy',
			korean: '아이비',
			english: 'Ivy',
			currentPrice: 123456,
			highPrice: 234567,
			lowPrice: 123123,
			previousClosingPrice: 123111,
			tradingVolume: 1234567,
			tradingAmount: 12345678,
		},
	],
});

export default stockListAtom;
