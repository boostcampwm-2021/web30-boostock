import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { Ipage } from '@src/app';
import User from '@recoil/user/index';

import style from './menu.module.scss';

interface Props {
	pages: Ipage[];
}

const Menu = ({ pages }: Props) => {
	const userState = useRecoilValue(User);

	const getMenu = () => {
		if (userState.isLoggedIn === true) {
			return (
				<div style={{ position: 'relative' }}>
					<NavLink to="/my" className={(isActive) => (isActive ? `${style.active}` : '')}>
						마이페이지
					</NavLink>
					<NavLink to="/balance" className={(isActive) => (isActive ? `${style.active}` : '')}>
						입출금
					</NavLink>
				</div>
			);
		}

		return (
			<div style={{ position: 'relative' }}>
				<NavLink to="/auth/signin" className={(isActive) => (isActive ? `${style.active}` : '')}>
					로그인
				</NavLink>
				<NavLink to="/auth/signup" className={(isActive) => (isActive ? `${style.active}` : '')}>
					회원가입
				</NavLink>
			</div>
		);
	};

	return (
		<nav className={style.container}>
			<div>
				{pages.map((page) => (
					<NavLink to={page.url} key={page.id} className={(isActive) => (isActive ? `${style.active}` : '')}>
						{page.title}
					</NavLink>
				))}
			</div>
			{getMenu()}
		</nav>
	);
};

export default Menu;
