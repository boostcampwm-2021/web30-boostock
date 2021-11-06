import React from 'react';
import { GrPowerReset } from 'react-icons/gr';

import style from './bidask.module.scss';

interface IProps {
	bidAskType: string;
	isAmountError: boolean;
	handleReset: () => void;
	handleBidAsk: () => void;
}

function orderActionClass(bidAskType: string): string {
	let result = style['bidask-action-btn'];

	if (bidAskType === '매수') result += ` ${style['bid-action']}`;
	if (bidAskType === '매도') result += ` ${style['ask-action']}`;
	if (bidAskType === '정정/취소') result += ` ${style['cancel-action']}`;

	return result;
}

const BidAskAction = ({
	bidAskType,
	isAmountError,
	handleReset,
	handleBidAsk,
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
				className={orderActionClass(bidAskType)}
				type="button"
				onClick={handleBidAsk}
				disabled={isAmountError}
			>
				{bidAskType}
			</button>
		</div>
	);
};

export default BidAskAction;
