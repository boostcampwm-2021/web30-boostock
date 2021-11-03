import React from 'react';
import { GrPowerReset } from 'react-icons/gr';

import style from './bidask.module.scss';

interface IProps {
	orderType: string;
	isAmountError: boolean;
	handleReset: () => void;
	handleOrder: () => void;
}

function orderActionClass(orderType: string): string {
	let result = style['bidask-action-btn'];

	if (orderType === '매수') result += ` ${style['bid-action']}`;
	if (orderType === '매도') result += ` ${style['ask-action']}`;
	if (orderType === '정정/취소') result += ` ${style['cancel-action']}`;

	return result;
}

const BidAskAction = ({
	orderType,
	isAmountError,
	handleReset,
	handleOrder,
}: IProps) => {
	return (
		<div className={style['bidask-action-container']}>
			<button
				onClick={handleReset}
				className={style['bidask-reset-btn']}
				type="button"
			>
				<span className={style['bidask-action-reset-icon']}>
					<GrPowerReset />
				</span>
				초기화
			</button>
			<button
				className={orderActionClass(orderType)}
				type="button"
				onClick={handleOrder}
				disabled={isAmountError}
			>
				{orderType}
			</button>
		</div>
	);
};

export default BidAskAction;
