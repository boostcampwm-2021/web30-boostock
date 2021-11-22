import { atom } from 'recoil';

export interface IChartItem {
	timestamp: number;
	priceStart: number;
	priceEnd: number;
	priceLow: number;
	priceHigh: number;
	amount: number;
}

const chartAtom = atom<IChartItem[]>({
	key: 'chatAtom',
	default: [
		{
			timestamp: 1637561386,
			priceStart: 3000,
			priceEnd: 7000,
			priceLow: 1000,
			priceHigh: 9000,
			amount: 1000,
		},
		{
			timestamp: 1637561386,
			priceStart: 7000,
			priceEnd: 3000,
			priceLow: 1000,
			priceHigh: 9000,
			amount: 2000,
		},
		{
			timestamp: 1637561386,
			priceStart: 3000,
			priceEnd: 3000,
			priceLow: 1000,
			priceHigh: 9000,
			amount: 3000,
		},
		{
			timestamp: 1637561386,
			priceStart: 7000,
			priceEnd: 7000,
			priceLow: 1000,
			priceHigh: 9000,
			amount: 4000,
		},
		{
			timestamp: 1637561386,
			priceStart: 3000,
			priceEnd: 7000,
			priceLow: 1000,
			priceHigh: 9000,
			amount: 5000,
		},
		{
			timestamp: 1637561386,
			priceStart: 7000,
			priceEnd: 3000,
			priceLow: 1000,
			priceHigh: 9000,
			amount: 5000,
		},
		{
			timestamp: 1637561386,
			priceStart: 3000,
			priceEnd: 7000,
			priceLow: 1000,
			priceHigh: 9000,
			amount: 5000,
		},
		{
			timestamp: 1637561386,
			priceStart: 3000,
			priceEnd: 7000,
			priceLow: 1000,
			priceHigh: 9000,
			amount: 5000,
		},
		{
			timestamp: 1637561386,
			priceStart: 3000,
			priceEnd: 7000,
			priceLow: 1000,
			priceHigh: 9000,
			amount: 5000,
		},
		{
			timestamp: 1637561386,
			priceStart: 3000,
			priceEnd: 7000,
			priceLow: 1000,
			priceHigh: 9000,
			amount: 5000,
		},
	],
});

export default chartAtom;
