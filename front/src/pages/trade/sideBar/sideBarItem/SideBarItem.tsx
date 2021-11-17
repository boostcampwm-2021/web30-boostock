import React, { MouseEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';

import caretIcon from '@src/common/utils/caretIcon';
import formatNumber from '@src/common/utils/formatNumber';
import { IStockListItem } from '@src/recoil/stockList/index';
import './SideBarItem.scss';

export interface Props {
	stock: IStockListItem;
	isFavorite: boolean;
	refresh: () => void;
}

const SideBarItem = (props: Props) => {
	const { stock, isFavorite, refresh } = props;
	const { code, nameKorean, price, previousClose, charts } = stock;

	const { volume = 0 } = charts.filter(({ type }) => type === 1440)[0] ?? [];
	const percent = ((price - previousClose) / previousClose) * 100;

	let status = '';
	if (percent === 0) status = '';
	else if (percent > 0) status = 'up';
	else if (percent < 0) status = 'down';

	const toggleFavorite = () => {
		fetch(`${process.env.SERVER_URL}/api/user/favorite`, {
			method: isFavorite ? 'DELETE' : 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({ stockCode: code }),
		}).then((res: Response) => {
			if (res.ok) {
				res.json().then((data) => {
					console.log(isFavorite, data);
				});
				refresh();
			}
		});
	};

	const toggleFavoriteKey = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.type === 'keydown' && event.keyCode !== 13) return;
		toggleFavorite();
	};

	return (
		<Link className={`sidebar__item ${status}`} to={`/trade/?code=${code}`}>
			<div
				className="sidebar__item-favorite"
				role="button"
				tabIndex={0}
				onClick={toggleFavorite}
				onKeyDown={toggleFavoriteKey}
			>
				<AiFillStar color={isFavorite ? '#FFA800' : '#999'} />
			</div>
			<div className="sidebar__item-name">{nameKorean}</div>
			<div className="sidebar__item-price">{formatNumber(price)}</div>
			<div className="sidebar__item-percent">
				<p className="sidebar__item-percent-top">
					{caretIcon(percent)}&nbsp;
					{percent.toFixed(1)}%
				</p>
				<p className="sidebar__item-percent-bottom">{formatNumber(price - previousClose)}</p>
			</div>
			<div className="sidebar__item-amount">
				<p className="sidebar__item-amount-value">{formatNumber(volume)}</p>
				<p className="sidebar__item-amount-unit">원</p>
			</div>
		</Link>
	);
};

export default SideBarItem;
