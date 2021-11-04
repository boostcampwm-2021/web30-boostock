import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import BidAskType from './BidAskType';
import BidAskInputs from './BidAskInputs';
import BidAskAction from './BidAskAction';

import style from './bidask.module.scss';

interface IOrderData {
	user_id: number;
	stock_id: number;
	type: number;
	option: number;
	amount: number;
	price: number;
}

const BidAsk = () => {
	const [orderType, setOrderType] = useState<string>('매수');
	const [orderOption, setOrderOption] = useState<string>('지정가');
	const [orderPrice, setOrderPrice] = useState<number>(0);
	const [orderAmount, setOrderAmount] = useState<number>(0);
	const [isAmountError, setIsAmountError] = useState<boolean>(false);

	const handleSetOrderType = (newType: string) => setOrderType(newType);

	const handleReset = () => {
		setOrderPrice(0);
		setOrderAmount(0);
		setIsAmountError(false);
	};

	const handleOrder = async () => {
		if (orderAmount === 0) {
			setIsAmountError(true);
			return;
		}

		const orderData: IOrderData = {
			user_id: 1,
			stock_id: 1,
			type: orderType === '매도' ? 0 : 1,
			option: orderOption === '지정가' ? 0 : 1,
			amount: orderAmount,
			price: orderPrice,
		};

		const config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(orderData),
		};

		try {
			const res = await fetch(
				`${process.env.SERVER_URL}/api/order`,
				config,
			);
			const data = await res;

			if (data.status !== 200) throw new Error();
			handleReset();
			toast.success('주문이 접수되었습니다.');
		} catch (error) {
			// 추후 상세 에러 처리 요망
			toast.error('주문 접수에 실패했습니다. \n\n다시 시도해 주세요.', {
				style: {
					textAlign: 'center',
					maxWidth: '236px',
				},
			});
		}
	};

	useEffect(() => {
		handleReset();
	}, [orderType, orderOption]);

	useEffect(() => {
		if (!isAmountError) return;
		if (orderAmount > 0) setIsAmountError(false);
	}, [orderAmount, isAmountError]);

	return (
		<div className={style['bidask-container']}>
			<Toaster />
			<BidAskType
				orderType={orderType}
				handleSetOrderType={handleSetOrderType}
			/>
			<div className={style['bidask-info-container']}>
				{orderType !== '정정/취소' && (
					<BidAskInputs
						orderType={orderType}
						orderOption={orderOption}
						orderPrice={orderPrice}
						orderAmount={orderAmount}
						isAmountError={isAmountError}
						setOrderOption={setOrderOption}
						setOrderPrice={setOrderPrice}
						setOrderAmount={setOrderAmount}
					/>
				)}
			</div>
			<BidAskAction
				orderType={orderType}
				isAmountError={isAmountError}
				handleReset={handleReset}
				handleOrder={handleOrder}
			/>
		</div>
	);
};

export default BidAsk;
