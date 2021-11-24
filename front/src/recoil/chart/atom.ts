import { atom } from 'recoil';

export interface IChartItem {
	createdAt: number;
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
			createdAt: 0,
			priceStart: 0,
			priceEnd: 0,
			priceLow: 0,
			priceHigh: 0,
			amount: 0,
		},
	],
});

export default chartAtom;
