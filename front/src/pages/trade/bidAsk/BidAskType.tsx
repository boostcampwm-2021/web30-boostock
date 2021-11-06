import React from 'react';

import style from './bidask.module.scss';

interface IProps {
	bidAskType: string;
	handleSetBidAskType: (newType: string) => void;
}

function orderTypeClass(bidAskType: string, curType: string): string {
	let result = style['bidask-type-select-list-item'];

	if (bidAskType === '매수') result += ` ${style['bidask-type-bid']}`;
	if (bidAskType === '매도') result += ` ${style['bidask-type-ask']}`;
	if (bidAskType === '정정/취소') result += ` ${style['bidask-type-cancel']}`;
	if (bidAskType === curType) result += ` ${style.on}`;

	return result;
}

const orderTypes = ['매수', '매도', '정정/취소'];

const BidAskType = ({ bidAskType, handleSetBidAskType }: IProps) => {
	return (
		<ul className={style['bidask-type-select-list']}>
			{orderTypes.map((type) => (
				<li
					key={type}
					className={`${orderTypeClass(type, bidAskType)}`}
				>
					<button
						className={style['bidask-type-select-list-btn']}
						type="button"
						onClick={() => handleSetBidAskType(type)}
					>
						{type}
					</button>
				</li>
			))}
		</ul>
	);
};

export default BidAskType;
