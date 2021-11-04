import { atom } from 'recoil';

export interface IUser {
	isLoggedIn: boolean;
	favorite: number[];
	hold: number[];
}

const userAtom = atom<IUser>({
	key: 'userAtom',
	default: {
		isLoggedIn: false,
		favorite: [1],
		hold: [2],
	},
});

export default userAtom;
