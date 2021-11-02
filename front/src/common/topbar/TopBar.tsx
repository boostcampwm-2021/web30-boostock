import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '@common/logo/Logo';
import { Ipage } from '@src/app';
import Menu from './menu/Menu';

import './topbar.scss';

const TopBar = ({ pages }: { pages: Ipage[] }) => {
	return (
		<header className="top-bar">
			<Link to="/home" style={{ display: 'flex' }}>
				<Logo />
			</Link>
			<Menu pages={pages} />
		</header>
	);
};

export default TopBar;
