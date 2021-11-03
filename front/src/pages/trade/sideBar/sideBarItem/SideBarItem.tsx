import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';

import './SideBarItem.scss';

export interface Props {
	stock: Stock;
}

export interface Stock {
	id: number;
	name: string;
	price: number;
	dtdPercent: number;
	dtdValue: number;
	volume: number;
}

const SideBarItem = (props: Props) => {
	const { stock } = props;
	const { id, name, price, dtdPercent, dtdValue, volume } = stock;

	let status = '';
	if (dtdPercent === 0) status = '';
	else if (dtdPercent > 0) status = 'up';
	else if (dtdPercent < 0) status = 'down';

	return (
		<Link className={`sidebar__item ${status}`} to={`/exchange/${id}`}>
			<div className="sidebar__item-favorite">
				<AiFillStar color="#999" />
			</div>
			<div className="sidebar__item-name">{name}</div>
			<div className="sidebar__item-price">{price.toLocaleString()}</div>
			<div className="sidebar__item-percent">
				<p className="sidebar__item-percent-top">
					{dtdPercent > 0 ? '+' : ''}
					{dtdPercent.toLocaleString()}%
				</p>
				<p className="sidebar__item-percent-bottom">
					{dtdValue > 0 ? '+' : ''}
					{dtdValue.toLocaleString()}
				</p>
			</div>
			<div className="sidebar__item-volume">
				<p className="sidebar__item-volume-value">
					{volume.toLocaleString()}
				</p>
				<p className="sidebar__item-volume-unit">만원</p>
			</div>
		</Link>
	);
};

export default SideBarItem;
