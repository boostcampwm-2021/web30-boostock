import React, { SyntheticEvent } from 'react';
import { BiInfoCircle } from 'react-icons/bi';
import formatNumber from '@src/common/utils/formatNumber';

interface IProps {
	bidAskType: string;
	bidAskPrice: number;
	bidAskAmount: number;
	isAmountError: boolean;
	askAvailable: number;
	bidAvailable: number;
	stockCode: string;
	setBidAskPrice: (arg: number) => void;
	setBidAskAmount: (arg: number) => void;
}

function orderAmountClass(isAmountError: boolean): string {
	let result = 'bidask-info-text-input';
	if (isAmountError) result += ' error';
	return result;
}

const BidAskInputs = ({
	bidAskType,
	bidAskPrice,
	bidAskAmount,
	isAmountError,
	bidAvailable,
	askAvailable,
	stockCode,
	setBidAskPrice,
	setBidAskAmount,
}: IProps) => {
	const handleOrderPrice = (e: SyntheticEvent) => {
		const target = e.target as HTMLInputElement;
		const price = Number(target.value.replace(/,/g, ''));

		if (Number.isNaN(price)) return;
		setBidAskPrice(price);
	};

	const handleOrderAmount = (e: SyntheticEvent) => {
		const target = e.target as HTMLInputElement;
		const amount = Number(target.value.replace(/,/g, ''));

		if (Number.isNaN(amount)) return;
		setBidAskAmount(amount);
	};

	const calculateTotalOrderPrice = (price: number, amount: number) => {
		return price * amount;
	};

	return (
		<ul className="bidask-info-list">
			<li className="bidask-info-list-item">
				<span className="bidask-info-text">종목코드</span>
				<span className="bidask-stock-code">{stockCode}</span>
			</li>
			<li className="bidask-info-list-item">
				<span className="bidask-info-text">{bidAskType === '매수' ? '매수가능' : '매도가능'}</span>
				<span className="bidask-info-price-container">
					<span className="bidask-info-price">
						{bidAskType === '매수' ? formatNumber(bidAvailable) : formatNumber(askAvailable)}
					</span>
					<span className="bidask-info-won-text">{bidAskType === '매수' ? '원' : '주'}</span>
				</span>
			</li>
			<li className="bidask-info-list-item">
				<span className="bidask-info-text">{bidAskType === '매수' ? '매수가격' : '매도가격'}</span>
				<div>
					<input
						className="bidask-info-text-input"
						type="text"
						value={formatNumber(bidAskPrice)}
						onChange={handleOrderPrice}
						maxLength={13}
					/>
					<span className="bidask-info-won-text">원</span>
				</div>
			</li>
			<li className="bidask-info-list-item">
				<span className="bidask-info-text">주문수량</span>
				<div className="bidask-amount-container">
					<input
						className={orderAmountClass(isAmountError)}
						type="text"
						value={formatNumber(bidAskAmount)}
						onChange={handleOrderAmount}
						maxLength={5}
					/>
					<span className="bidask-info-won-text">주</span>
					{isAmountError && (
						<small className="bidask-error-notice">
							<span>
								<BiInfoCircle />
							</span>
							수량을 입력해 주세요.
						</small>
					)}
				</div>
			</li>
			<li className="bidask-info-list-item">
				<span className="bidask-info-text">주문총액</span>
				<div className="bidask-total-price-container">
					<span className="bidask-total-price">
						{formatNumber(calculateTotalOrderPrice(bidAskPrice, bidAskAmount))}
					</span>
					<span className="bidask-info-won-text">원</span>
				</div>
			</li>
		</ul>
	);
};

export default BidAskInputs;
