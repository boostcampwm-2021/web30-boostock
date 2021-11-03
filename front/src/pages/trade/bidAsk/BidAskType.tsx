import React from 'react';

import style from './bidask.module.scss';

interface IProps {
	orderType: string;
	handleSetOrderType: (newType: string) => void;
}

function orderTypeClass(orderType: string, curType: string): string {
	let result = style['bidask-type-select-list-item'];

	if (orderType === '매수') result += ` ${style['bidask-type-bid']}`;
	if (orderType === '매도') result += ` ${style['bidask-type-ask']}`;
	if (orderType === '정정/취소') result += ` ${style['bidask-type-cancel']}`;
	if (orderType === curType) result += ` ${style.on}`;

	return result;
}

const orderTypes = ['매수', '매도', '정정/취소'];

const BidAskType = ({ orderType, handleSetOrderType }: IProps) => {
	return (
		<ul className={style['bidask-type-select-list']}>
			{orderTypes.map((type) => (
				<li key={type} className={`${orderTypeClass(type, orderType)}`}>
					<button
						className={style['bidask-type-select-list-btn']}
						type="button"
						onClick={() => handleSetOrderType(type)}
					>
						{type}
					</button>
				</li>
			))}
		</ul>
	);
};

export default BidAskType;
