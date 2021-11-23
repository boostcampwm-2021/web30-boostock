import { atom } from 'recoil';

const holdStockListAtom = atom<string[]>({
	key: 'holdStockListAtom',
	default: [],
});

export default holdStockListAtom;
