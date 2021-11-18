import { atom } from 'recoil';

export const askAvailableAtom = atom<number>({
	key: 'askAvailableAtom',
	default: 0,
});

export const bidAvailableAtom = atom<number>({
	key: 'bidAvailableAtom',
	default: 0,
});
