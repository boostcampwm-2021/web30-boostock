import { atom } from 'recoil';

const bidAskPriceAtom = atom<number>({
	key: 'bidAskPriceAtom',
	default: 0,
});

export default bidAskPriceAtom;
