import { atom } from 'recoil';

export interface IUser {
	isLoggedIn: boolean;
}

const userAtom = atom<IUser>({
	key: 'userAtom',
	default: {
		isLoggedIn: false,
	},
});

export default userAtom;
