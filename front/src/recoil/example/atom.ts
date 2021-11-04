import { atom } from 'recoil';

const exampleAtom = atom<number>({
	key: 'exampleAtom',
	default: 0,
});

export default exampleAtom;
