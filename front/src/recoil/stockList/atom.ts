import { atom } from 'recoil';
import { IStockListItem } from '@src/types';

const stockListAtom = atom<IStockListItem[]>({
	key: 'stockListAtom',
	default: [],
});

export default stockListAtom;
