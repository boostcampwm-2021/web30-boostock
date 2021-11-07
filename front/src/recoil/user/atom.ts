import { atom } from 'recoil';

export interface IUser {
	isLoggedIn: boolean;
	favorite: number[];
	hold: number[];
	theme: 'light' | 'dark';
}

const userAtom = atom<IUser>({
	key: 'userAtom',
	default: {
		isLoggedIn: false,
		favorite: [1],
		hold: [2],
		theme: 'light',
	},
});

export default userAtom;
