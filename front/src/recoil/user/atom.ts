import { atom } from 'recoil';
import { IUser } from '@src/types';

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
