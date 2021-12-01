import React from 'react';
import { Link } from 'react-router-dom';

import caretIcon from '@src/common/utils/caretIcon';
import formatNumber from '@src/common/utils/formatNumber';
import { truncateNumber, truncateUnit } from '@src/common/utils/truncateNumber';
import { IStockListItem } from '@src/types';
import ToggleFavorite from './ToggleFavorite';
import './SideBarItem.scss';

export interface IProps {
	stock: IStockListItem;
	isLoggedIn: boolean;
	isFavorite: boolean;
	onRefresh: (isLoggedIn: boolean) => void;
}

const SideBarItem = ({ stock, isLoggedIn, isFavorite, onRefresh }: IProps) => {
	const { code, nameKorean, price, previousClose, charts } = stock;

	const { volume = '0' } = charts.filter(({ type }) => type === 1440)[0] ?? [];
	const percent = ((price - previousClose) / previousClose) * 100;

	let status = '';
	if (percent === 0) status = '';
	else if (percent > 0) status = 'up';
	else if (percent < 0) status = 'down';

	return (
		<Link className={`sidebar__item ${status}`} to={`?code=${code}`}>
			<ToggleFavorite
				isFavorite={isFavorite}
				isLoggedIn={isLoggedIn}
				stockCode={code}
				onRefresh={onRefresh}
				nameKorean={nameKorean}
			/>
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
				<p className="sidebar__item-amount-value">{formatNumber(truncateNumber(volume))}</p>
				<p className="sidebar__item-amount-unit">{truncateUnit(volume, '원')}</p>
			</div>
		</Link>
	);
};

export default SideBarItem;
