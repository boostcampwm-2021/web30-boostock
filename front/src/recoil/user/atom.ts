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
		favorite: [],
		hold: [],
		theme: 'light',
	},
});

export default userAtom;
