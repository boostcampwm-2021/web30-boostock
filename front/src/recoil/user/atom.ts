import { atom } from 'recoil';

export interface IUser {
	username: string;
	email: string;
	isLoggedIn: boolean;
	theme: 'light' | 'dark';
}

const userAtom = atom<IUser>({
	key: 'userAtom',
	default: {
		username: '',
		email: '',
		isLoggedIn: false,
		theme: 'light',
	},
});

export default userAtom;
