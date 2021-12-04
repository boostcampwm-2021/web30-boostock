import { atom } from 'recoil';
import { IDailyLog } from '@src/types';

const dailyLogAtom = atom<IDailyLog[]>({
	key: 'dailyLogAtom',
	default: [],
});

export default dailyLogAtom;
