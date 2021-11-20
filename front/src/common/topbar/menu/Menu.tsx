import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { Ipage } from '@src/app';
import User from '@recoil/user/index';
import UserIcon from './UserIcon';

import './menu.scss';

interface Props {
	pages: Ipage[];
}

function userIconClass(isDropdownOpen: boolean): string {
	if (isDropdownOpen) return 'navbar__user open';
	return 'navbar__user';
}

const Menu = ({ pages }: Props) => {
	const userState = useRecoilValue(User);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

	const handleToggleDropdownOpen = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	useEffect(() => {
		const handleCloseDropdown = (e: Event) => {
			const target = e.target as HTMLElement;
			if (target.closest('.navbar__user-icon')) return;
			setIsDropdownOpen(false);
		};

		document.addEventListener('click', handleCloseDropdown);

		return () => {
			document.removeEventListener('click', handleCloseDropdown);
		};
	}, []);

	const getMenu = () => {
		if (userState.isLoggedIn === true) {
			return (
				<div className={userIconClass(isDropdownOpen)}>
					<button type="button" className="navbar__user-icon" onClick={handleToggleDropdownOpen}>
						<UserIcon />
					</button>
					{isDropdownOpen && (
						<ul className="navbar__user-dropdown-list">
							<li className="navbar__user-dropdown-item">
								<Link to="/my">마이페이지</Link>
							</li>
							<li className="navbar__user-dropdown-item">
								<Link to="/balance">입출금</Link>
							</li>
							<li className="navbar__user-dropdown-item">
								<button type="button" className="logout-btn">
									로그아웃
								</button>
							</li>
						</ul>
					)}
				</div>
			);
		}

		return (
			<div className="auth-actions">
				<NavLink to="/auth/signin" className="navbar__signin">
					로그인
				</NavLink>
				<NavLink to="/auth/signup" className="navbar__signup">
					회원가입
				</NavLink>
			</div>
		);
	};

	return (
		<nav className="container">
			<div>
				{pages.map((page) => (
					<NavLink to={page.url} key={page.id} className={(isActive) => (isActive ? 'active' : '')}>
						{page.title}
					</NavLink>
				))}
			</div>
			{getMenu()}
		</nav>
	);
};

export default Menu;
