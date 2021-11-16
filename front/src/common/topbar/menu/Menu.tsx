import React from 'react';
import { NavLink } from 'react-router-dom';
import { Ipage } from '@src/app';

import style from './menu.module.scss';

interface Props {
	pages: Ipage[];
}

const Menu = ({ pages }: Props) => {
	return (
		<nav className={style.container}>
			<div>
				{pages.map((page) => (
					<NavLink to={page.url} key={page.id} className={(isActive) => (isActive ? `${style.active}` : '')}>
						{page.title}
					</NavLink>
				))}
			</div>
			<div style={{ position: 'relative' }}>
				<NavLink to="/auth/signin" className={(isActive) => (isActive ? `${style.active}` : '')}>
					로그인
				</NavLink>
				<NavLink to="/auth/signup" className={(isActive) => (isActive ? `${style.active}` : '')}>
					회원가입
				</NavLink>
				<NavLink to="/my" className={(isActive) => (isActive ? `${style.active}` : '')}>
					마이페이지
				</NavLink>
				<NavLink to="/balance" className={(isActive) => (isActive ? `${style.active}` : '')}>
					입출금
				</NavLink>
			</div>
		</nav>
	);
};

export default Menu;
