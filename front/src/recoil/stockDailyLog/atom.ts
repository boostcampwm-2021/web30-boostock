import { atom } from 'recoil';

export interface IDailyLog {
	_id: string;
	priceEnd: number;
	amount: number;
	createdAt: number;
}

const dailyLogAtom = atom<IDailyLog[]>({
	key: 'dailyLogAtom',
	default: [],
});

export default dailyLogAtom;
