import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';
import { IStockListItem } from '@src/recoil/stockList/index';

import './SideBarItem.scss';

export interface Props {
	stock: IStockListItem;
	isFavorite: boolean;
}

const SideBarItem = (props: Props) => {
	const { stock, isFavorite } = props;
	const { name, currentPrice, previousClosingPrice, tradingAmount } = stock;

	const percent =
		((currentPrice - previousClosingPrice) / previousClosingPrice) * 100;
	let status = '';
	if (percent === 0) status = '';
	else if (percent > 0) status = 'up';
	else if (percent < 0) status = 'down';

	return (
		<Link className={`sidebar__item ${status}`} to={`/exchange/${name}`}>
			<div className="sidebar__item-favorite">
				<AiFillStar color={isFavorite ? '$primary' : '#999'} />
			</div>
			<div className="sidebar__item-name">{name}</div>
			<div className="sidebar__item-price">
				{currentPrice.toLocaleString()}
			</div>
			<div className="sidebar__item-percent">
				<p className="sidebar__item-percent-top">
					{percent > 0 ? '+' : ''}
					{percent.toFixed(1)}%
				</p>
				<p className="sidebar__item-percent-bottom">
					{currentPrice - previousClosingPrice > 0 ? '+' : ''}
					{(currentPrice - previousClosingPrice).toLocaleString()}
				</p>
			</div>
			<div className="sidebar__item-amount">
				<p className="sidebar__item-amount-value">
					{tradingAmount.toLocaleString()}
				</p>
				<p className="sidebar__item-amount-unit">원</p>
			</div>
		</Link>
	);
};

export default SideBarItem;
