import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import StockList, { IStockListItem } from '@recoil/stockList/index';
import SideBarItem from './sideBarItem/SideBarItem';

import './SideBar.scss';

export enum MENU {
	ALL = '전체',
	FAVORITE = '관심',
	HOLD = '보유',
}

// interface Props {}

const SideBar = () => {
	const [menu, setMenu] = useState(MENU.FAVORITE);
	const stockListState = useRecoilValue(StockList);

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
				<div className="sidebar__legend-amount">거래대금</div>
			</div>
			{stockListState.map((stock: IStockListItem) => (
				<SideBarItem key={stock.id} stock={stock} />
			))}
		</div>
	);
};

export default SideBar;
