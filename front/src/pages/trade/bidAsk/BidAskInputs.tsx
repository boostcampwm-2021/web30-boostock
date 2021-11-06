import React, { SyntheticEvent } from 'react';
import { BiInfoCircle } from 'react-icons/bi';
import formatNumber from '@src/common/utils/formatNumber';

import style from './bidask.module.scss';

interface IProps {
	bidAskType: string;
	bidAskOption: string;
	bidAskPrice: number;
	bidAskAmount: number;
	isAmountError: boolean;
	setBidAskOption: (arg: string) => void;
	setBidAskPrice: (arg: number) => void;
	setBidAskAmount: (arg: number) => void;
}

function orderAmountClass(isAmountError: boolean): string {
	let result = style['bidask-info-text-input'];
	if (isAmountError) result += ` ${style.error}`;
	return result;
}

const BidAskInputs = ({
	bidAskType,
	bidAskOption,
	bidAskPrice,
	bidAskAmount,
	isAmountError,
	setBidAskOption,
	setBidAskPrice,
	setBidAskAmount,
}: IProps) => {
	const handleSetOrderOption = (e: SyntheticEvent) => {
		const target = e.target as HTMLInputElement;
		setBidAskOption(target.value);
	};

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
		<ul className={style['bidask-info-list']}>
			<li className={style['bidask-info-list-item']}>
				<span className={style['bidask-info-text']}>주문구분</span>
				<span>
					<input
						id="bidask-option-designated"
						className={style['bidask-option-radio-input']}
						type="radio"
						name="bidask-option"
						value="지정가"
						checked={bidAskOption === '지정가'}
						onChange={handleSetOrderOption}
					/>
					{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					<label
						className={style['bidask-option-label']}
						htmlFor="bidask-option-designated"
					>
						지정가
					</label>
					<input
						id="bidask-option-market"
						className={style['bidask-option-radio-input']}
						type="radio"
						name="bidask-option"
						value="시장가"
						checked={bidAskOption === '시장가'}
						onChange={handleSetOrderOption}
					/>
					{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					<label
						htmlFor="bidask-option-market"
						className={style['bidask-option-label']}
					>
						시장가
					</label>
				</span>
			</li>
			<li className={style['bidask-info-list-item']}>
				<span className={style['bidask-info-text']}>
					{bidAskType === '매수' ? '매수가능' : '매도가능'}
				</span>
				<span className={style['bidask-info-price-container']}>
					<span className={style['bidask-info-price']}>
						123,456,789
					</span>
					<span className={style['bidask-info-won-text']}>
						{bidAskType === '매수' ? '원' : '주'}
					</span>
				</span>
			</li>
			{bidAskOption === '지정가' && (
				<li className={style['bidask-info-list-item']}>
					<span className={style['bidask-info-text']}>
						{bidAskType === '매수' ? '매수가격' : '매도가격'}
					</span>
					<div>
						<input
							className={style['bidask-info-text-input']}
							type="text"
							dir="rtl"
							value={formatNumber(bidAskPrice)}
							onChange={handleOrderPrice}
						/>
						<span className={style['bidask-info-won-text']}>
							원
						</span>
					</div>
				</li>
			)}
			<li className={style['bidask-info-list-item']}>
				<span className={style['bidask-info-text']}>주문수량</span>
				<div className={style['bidask-amount-container']}>
					<input
						className={orderAmountClass(isAmountError)}
						type="text"
						dir="rtl"
						value={formatNumber(bidAskAmount)}
						onChange={handleOrderAmount}
					/>
					<span className={style['bidask-info-won-text']}>주</span>
					{isAmountError && (
						<small className={style['bidask-error-notice']}>
							<span>
								<BiInfoCircle />
							</span>
							수량을 입력해 주세요.
						</small>
					)}
				</div>
			</li>
			{bidAskOption === '지정가' && (
				<li className={style['bidask-info-list-item']}>
					<span className={style['bidask-info-text']}>주문총액</span>
					<div className={style['bidask-total-price-container']}>
						<span className={style['bidask-total-price']}>
							{formatNumber(
								calculateTotalOrderPrice(
									bidAskPrice,
									bidAskAmount,
								),
							)}
						</span>
						<span className={style['bidask-info-won-text']}>
							원
						</span>
					</div>
				</li>
			)}
		</ul>
	);
};

export default BidAskInputs;
