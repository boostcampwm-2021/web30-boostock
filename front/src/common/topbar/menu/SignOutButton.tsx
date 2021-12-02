import React from 'react';
import toast from 'react-hot-toast';
import { useSetRecoilState } from 'recoil';
import { IUser } from '@src/types';
import userAtom from '@recoil/user';
import { signOut } from '@lib/api';

const SignOutButton = () => {
	const setUserState = useSetRecoilState<IUser>(userAtom);

	const handleLogout = async () => {
		const signOutResult = await signOut();
		if (!signOutResult) {
			toast.error('로그아웃에 실패했습니다. 다시 시도해 주세요.');
			return;
		}

		setUserState({ username: '', email: '', isLoggedIn: false, theme: 'light' });
		toast.success('성공적으로 로그아웃 되었습니다.');
	};

	return (
		<button type="button" className="logout-btn" onClick={handleLogout}>
			로그아웃
		</button>
	);
};

export default SignOutButton;
