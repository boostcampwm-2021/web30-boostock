import React, { SyntheticEvent, useState } from 'react';
import formatNumber from '@src/common/utils/formatNumber';

import style from './order.module.scss';

function orderTypeClass(orderType: string, curType: string): string {
	let result = style['order-type-select-list-item'];

	if (orderType === '매수') result += ` ${style['order-type-bid']}`;
	if (orderType === '매도') result += ` ${style['order-type-ask']}`;
	if (orderType === curType) result += ` ${style.on}`;

	return result;
}

function orderActionClass(orderType: string): string {
	let result = style['order-action-btn'];

	if (orderType === '매수') result += ` ${style['bid-action']}`;
	if (orderType === '매도') result += ` ${style['ask-action']}`;

	return result;
}

const Order = () => {
	const [orderType, setOrderType] = useState<string>('매수');
	const [orderOption, setOrderOption] = useState<string>('지정가');
	const [orderPrice, setOrderPrice] = useState<number>(0);
	const [orderAmount, setOrderAmount] = useState<number>(0);

	const handleSetOrderType = (newType: string) => setOrderType(newType);

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

	return (
		<div className={style['order-container']}>
			<ul className={style['order-type-select-list']}>
				<li className={`${orderTypeClass('매수', orderType)}`}>
					<button
						className={style['order-type-select-list-btn']}
						type="button"
						onClick={() => handleSetOrderType('매수')}
					>
						매수
					</button>
				</li>
				<li className={orderTypeClass('매도', orderType)}>
					<button
						className={style['order-type-select-list-btn']}
						type="button"
						onClick={() => handleSetOrderType('매도')}
					>
						매도
					</button>
				</li>
			</ul>
			<div className={style['order-info-container']}>
				<ul className={style['order-info-list']}>
					<li className={style['order-info-list-item']}>
						<span className={style['order-info-text']}>
							주문구분
						</span>
						<span>
							<input
								id="order-option-designated"
								className={style['order-option-radio-input']}
								type="radio"
								name="order-option"
								value="지정가"
								checked={orderOption === '지정가'}
								onChange={handleSetOrderOption}
							/>
							{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
							<label
								className={style['order-option-label']}
								htmlFor="order-option-designated"
							>
								지정가
							</label>
							<input
								id="order-option-market"
								className={style['order-option-radio-input']}
								type="radio"
								name="order-option"
								value="시장가"
								checked={orderOption === '시장가'}
								onChange={handleSetOrderOption}
							/>
							{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
							<label
								htmlFor="order-option-market"
								className={style['order-option-label']}
							>
								시장가
							</label>
						</span>
					</li>
					<li className={style['order-info-list-item']}>
						<span className={style['order-info-text']}>
							{orderType === '매수' ? '매수가능' : '매도가능'}
						</span>
						<span className={style['order-info-price-container']}>
							<span className={style['order-info-price']}>
								123,456,789
							</span>
							<span className={style['order-info-won-text']}>
								원
							</span>
						</span>
					</li>
					<li className={style['order-info-list-item']}>
						<span className={style['order-info-text']}>
							매수가격(원)
						</span>
						<input
							className={style['order-info-text-input']}
							type="text"
							dir="rtl"
							value={formatNumber(orderPrice)}
							onChange={handleOrderPrice}
						/>
					</li>
					<li className={style['order-info-list-item']}>
						<span className={style['order-info-text']}>
							주문수량(주)
						</span>
						<input
							className={style['order-info-text-input']}
							type="text"
							dir="rtl"
							value={formatNumber(orderAmount)}
							onChange={handleOrderAmount}
						/>
					</li>
					<li className={style['order-info-list-item']}>
						<span className={style['order-info-text']}>
							주문총액(원)
						</span>
						<input
							className={style['order-info-text-input']}
							type="text"
							dir="rtl"
						/>
					</li>
				</ul>
				<div className={style['order-action-container']}>
					<button className={style['order-reset-btn']} type="button">
						초기화
					</button>
					<button
						className={orderActionClass(orderType)}
						type="button"
					>
						{orderType === '매수' ? '매수' : '매도'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Order;
