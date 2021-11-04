import { selector } from 'recoil';
import exampleAtom from './atom';

const exampleWithSomething = selector<number>({
	key: 'exampleWithSomething',
	get: ({ get }) => get(exampleAtom) + Math.random(),
	set: ({ set }, newValue) => {
		set(exampleAtom, newValue);
	},
});

export default exampleWithSomething;
