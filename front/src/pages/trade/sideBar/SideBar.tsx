import React, { useState } from 'react';
import SideBarItem, { Stock } from './sideBarItem/SideBarItem';

import './SideBar.scss';

export enum MENU {
	ALL = '전체',
	FAVORITE = '관심',
	HOLD = '보유',
}

// interface Props {}

const stocks = [
	{
		id: 1,
		name: '호눅스코인',
		price: 1234567,
		dtdPercent: 1234,
		dtdValue: 1234,
		volume: 123456789,
	},
	{
		id: 2,
		name: '크롱코인',
		price: 1234,
		dtdPercent: -12,
		dtdValue: -1234,
		volume: 123456789,
	},
	{
		id: 3,
		name: 'JK코인',
		price: 1234,
		dtdPercent: 0,
		dtdValue: 0,
		volume: 123456789,
	},
];

const SideBar = () => {
	const [menu, setMenu] = useState(MENU.FAVORITE);

	return (
		<div className="sidebar">
			<div className="sidebar__menu">
				<div
					className={`sidebar__menu-item ${
						menu === MENU.ALL ? 'selected' : ''
					}`}
					role="button"
					tabIndex={0}
					onClick={() => setMenu(MENU.ALL)}
					onKeyDown={() => setMenu(MENU.ALL)}
				>
					{MENU.ALL}
				</div>
				<div
					className={`sidebar__menu-item ${
						menu === MENU.FAVORITE ? 'selected' : ''
					}`}
					role="button"
					tabIndex={0}
					onClick={() => setMenu(MENU.FAVORITE)}
					onKeyDown={() => setMenu(MENU.FAVORITE)}
				>
					{MENU.FAVORITE}
				</div>
				<div
					className={`sidebar__menu-item ${
						menu === MENU.HOLD ? 'selected' : ''
					}`}
					role="button"
					tabIndex={0}
					onClick={() => setMenu(MENU.HOLD)}
					onKeyDown={() => setMenu(MENU.HOLD)}
				>
					{MENU.HOLD}
				</div>
			</div>
			<div className="sidebar__legend">
				<div className="sidebar__legend-favorite" />
				<div className="sidebar__legend-name">이름</div>
				<div className="sidebar__legend-price">현재가</div>
				<div className="sidebar__legend-percent">전일대비</div>
				<div className="sidebar__legend-volume">거래량</div>
			</div>
			{stocks.map((stock: Stock) => (
				<SideBarItem key={stock.id} stock={stock} />
			))}
		</div>
	);
};

export default SideBar;
