import { atom } from 'recoil';
import { IAskOrderItem, IBidOrderItem } from '@src/types';

const askOrdersAtom = atom<IAskOrderItem[]>({
	key: 'askOrdersAtom',
	default: [],
});

const bidOrdersAtom = atom<IBidOrderItem[]>({
	key: 'bidOrdersAtom',
	default: [],
});

export { askOrdersAtom, bidOrdersAtom };
