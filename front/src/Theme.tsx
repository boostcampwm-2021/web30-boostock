import React from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '@recoil/user';

interface IProps {
	children: React.ReactNode;
}

const Theme = ({ children }: IProps) => {
	const { theme } = useRecoilValue(userAtom);

	return <main className={theme === 'light' ? 'theme-container' : 'theme-container dark-theme'}>{children}</main>;
};

export default Theme;
