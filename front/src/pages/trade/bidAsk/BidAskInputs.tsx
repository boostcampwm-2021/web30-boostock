import React, { SyntheticEvent } from 'react';
import { BiInfoCircle } from 'react-icons/bi';
import formatNumber from '@src/common/utils/formatNumber';

import style from './bidask.module.scss';

interface IProps {
	orderType: string;
	orderOption: string;
	orderPrice: number;
	orderAmount: number;
	isAmountError: boolean;
	setOrderOption: (arg: string) => void;
	setOrderPrice: (arg: number) => void;
	setOrderAmount: (arg: number) => void;
}

function orderAmountClass(isAmountError: boolean): string {
	let result = style['bidask-info-text-input'];
	if (isAmountError) result += ` ${style.error}`;
	return result;
}

const BidAskInputs = ({
	orderType,
	orderOption,
	orderPrice,
	orderAmount,
	isAmountError,
	setOrderOption,
	setOrderPrice,
	setOrderAmount,
}: IProps) => {
	const handleSetOrderOption = (e: SyntheticEvent) => {
		const target = e.target as HTMLInputElement;
		setOrderOption(target.value);
	};

	const handleOrderPrice = (e: SyntheticEvent) => {
		const target = e.target as HTMLInputElement;
		const price = Number(target.value.replace(/,/g, ''));

		if (Number.isNaN(price)) return;
		setOrderPrice(price);
	};

	const handleOrderAmount = (e: SyntheticEvent) => {
		const target = e.target as HTMLInputElement;
		const amount = Number(target.value.replace(/,/g, ''));

		if (Number.isNaN(amount)) return;
		setOrderAmount(amount);
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
						checked={orderOption === '지정가'}
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
						checked={orderOption === '시장가'}
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
					{orderType === '매수' ? '매수가능' : '매도가능'}
				</span>
				<span className={style['bidask-info-price-container']}>
					<span className={style['bidask-info-price']}>
						123,456,789
					</span>
					<span className={style['bidask-info-won-text']}>
						{orderType === '매수' ? '원' : '주'}
					</span>
				</span>
			</li>
			{orderOption === '지정가' && (
				<li className={style['bidask-info-list-item']}>
					<span className={style['bidask-info-text']}>
						{orderType === '매수' ? '매수가격' : '매도가격'}
					</span>
					<div>
						<input
							className={style['bidask-info-text-input']}
							type="text"
							dir="rtl"
							value={formatNumber(orderPrice)}
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
						value={formatNumber(orderAmount)}
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
			{orderOption === '지정가' && (
				<li className={style['bidask-info-list-item']}>
					<span className={style['bidask-info-text']}>주문총액</span>
					<div className={style['bidask-total-price-container']}>
						<span className={style['bidask-total-price']}>
							{formatNumber(
								calculateTotalOrderPrice(
									orderPrice,
									orderAmount,
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
