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
					<NavLink
						to={page.url}
						key={page.id}
						className={(isActive) =>
							isActive ? `${style.active}` : ''
						}
					>
						{page.title}
					</NavLink>
				))}
			</div>
			<div style={{ position: 'relative' }}>
				<NavLink
					to="/signin"
					className={(isActive) =>
						isActive ? `${style.active}` : ''
					}
				>
					로그인
				</NavLink>
				<NavLink
					to="/signup"
					className={(isActive) =>
						isActive ? `${style.active}` : ''
					}
				>
					회원가입
				</NavLink>
			</div>
		</nav>
	);
};

export default Menu;
