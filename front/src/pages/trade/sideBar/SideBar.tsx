import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import User from '@recoil/user/index';
import StockList, { IStockListItem } from '@recoil/stockList/index';
import SideBarItem from './sideBarItem/SideBarItem';

import './SideBar.scss';
import SearchBar from './searchbar/SearchBar';
import getRegExp from './getRegExp';
import SideBarNav, { MENU } from './sideBarNav/SideBarNav';

// interface Props {}

const SideBar = () => {
	const [menu, setMenu] = useState(MENU.ALL);
	const userState = useRecoilValue(User);
	const stockListState = useRecoilValue(StockList);
	const [filteredStockListState, setFilteredStockListState] = useState<
		IStockListItem[]
	>([]);

	const [regex, setRegex] = useState(/.*/);

	console.log(stockListState);

	const searchEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRegex(getRegExp(event?.target?.value));
	};

	useEffect(() => {
		setFilteredStockListState(() => {
			switch (menu) {
				case MENU.FAVORITE:
					return stockListState.filter((stock: IStockListItem) =>
						userState.favorite.includes(stock.stockId),
					);
				case MENU.HOLD:
					return stockListState.filter((stock: IStockListItem) =>
						userState.hold.includes(stock.stockId),
					);
				default:
					return stockListState;
			}
		});
	}, [menu, stockListState, userState.favorite, userState.hold]);

	return (
		<div className="sidebar">
			<div className="sidebar__menu">
				{Object.keys(MENU).map((key, index) => (
					<SideBarNav
						setMenu={setMenu}
						index={index}
						className={`sidebar__menu-item ${
							menu === MENU[key as keyof typeof MENU]
								? 'selected'
								: ''
						}`}
					/>
				))}
			</div>
			<SearchBar searchEvent={searchEvent} />
			<div className="sidebar__legend">
				<div className="sidebar__legend-favorite" />
				<div className="sidebar__legend-name">이름</div>
				<div className="sidebar__legend-price">현재가</div>
				<div className="sidebar__legend-percent">전일대비</div>
				<div className="sidebar__legend-amount">거래대금</div>
			</div>
			<div className="sidebar__items">
				{filteredStockListState
					.filter(
						(stock: IStockListItem) =>
							regex.test(stock.code.toLowerCase()) ||
							regex.test(stock.nameKorean) ||
							regex.test(stock.nameEnglish.toLowerCase()),
					)
					.map((stock: IStockListItem) => (
						<SideBarItem
							key={stock.stockId}
							stock={stock}
							isFavorite={userState.favorite.includes(
								stock.stockId,
							)}
						/>
					))}
			</div>
		</div>
	);
};

export default SideBar;
