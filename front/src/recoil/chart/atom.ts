import { atom } from 'recoil';
import { IChartItem } from '@src/types';

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
