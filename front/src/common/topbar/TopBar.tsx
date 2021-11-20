import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '@common/logo/Logo';
import { Ipage } from '@src/app';
import Menu from './menu/Menu';
import ModeSwitch from './modeSwitch/ModeSwitch';

import './topbar.scss';

const TopBar = ({ pages }: { pages: Ipage[] }) => {
	return (
		<header className="top-bar">
			<section className="top-bar-wrapper">
				<Link to="/" style={{ display: 'flex' }}>
					<Logo />
				</Link>
				<Menu pages={pages} />
				<ModeSwitch />
			</section>
		</header>
	);
};

export default TopBar;
