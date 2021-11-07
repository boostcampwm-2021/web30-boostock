import React from 'react';

interface IProps {
	bidAskType: string;
	handleSetBidAskType: (newType: string) => void;
}

function orderTypeClass(bidAskType: string, curType: string): string {
	let result = 'bidask-type-select-list-item';

	if (bidAskType === '매수') result += ' bidask-type-bid';
	if (bidAskType === '매도') result += ' bidask-type-ask';
	if (bidAskType === '정정/취소') result += ' bidask-type-cancel';
	if (bidAskType === curType) result += ' on';

	return result;
}

const orderTypes = ['매수', '매도', '정정/취소'];

const BidAskType = ({ bidAskType, handleSetBidAskType }: IProps) => {
	return (
		<ul className="bidask-type-select-list">
			{orderTypes.map((type) => (
				<li
					key={type}
					className={`${orderTypeClass(type, bidAskType)}`}
				>
					<button
						className="bidask-type-select-list-btn"
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
