import React from 'react';

import './topbar.scss';

interface Props {}

const TopBar = (props: Props) => {
	return (
		<nav className="top-bar">
			<span>아이콘</span>
			<span>검색창</span>
			<span>마이페이지</span>
		</nav>
	);
};

export default TopBar;
