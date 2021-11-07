import React from 'react';
import { GrPowerReset } from 'react-icons/gr';

interface IProps {
	bidAskType: string;
	isAmountError: boolean;
	handleReset: () => void;
	handleBidAsk: () => void;
}

function orderActionClass(bidAskType: string): string {
	let result = 'bidask-action-btn';

	if (bidAskType === '매수') result += ' bid-action';
	if (bidAskType === '매도') result += ' ask-action';
	if (bidAskType === '정정/취소') result += ' cancel-action';

	return result;
}

const BidAskAction = ({
	bidAskType,
	isAmountError,
	handleReset,
	handleBidAsk,
}: IProps) => {
	return (
		<div className="bidask-action-container">
			<button
				onClick={handleReset}
				className="bidask-reset-btn"
				type="button"
			>
				<span className="bidask-action-reset-icon">
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
