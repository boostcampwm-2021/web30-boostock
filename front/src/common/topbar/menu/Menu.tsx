import React from 'react';
import { Link } from 'react-router-dom';
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
					<Link to={page.url} key={page.id}>
						{page.title}
					</Link>
				))}
			</div>
			<div style={{ position: 'relative' }}>
				<Link to="/signin">로그인</Link>
				<Link to="/signup">회원가입</Link>
			</div>
		</nav>
	);
};

export default Menu;
