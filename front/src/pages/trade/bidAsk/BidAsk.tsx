import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
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
	const [bidAskType, setBidAskType] = useState<string>('매수');
	const [bidAskOption, setBidAskOption] = useState<string>('지정가');
	const [bidAskPrice, setBidAskPrice] = useState<number>(0);
	const [bidAskAmount, setBidAskAmount] = useState<number>(0);
	const [isAmountError, setIsAmountError] = useState<boolean>(false);

	const handleSetBidAskType = (newType: string) => setBidAskType(newType);

	const handleReset = () => {
		setBidAskPrice(0);
		setBidAskAmount(0);
		setIsAmountError(false);
	};

	const handleBidAsk = async () => {
		if (bidAskAmount === 0) {
			setIsAmountError(true);
			return;
		}

		const orderData: IOrderData = {
			user_id: 1,
			stock_id: 1,
			type: bidAskType === '매도' ? 0 : 1,
			option: bidAskOption === '지정가' ? 0 : 1,
			amount: bidAskAmount,
			price: bidAskPrice,
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
	}, [bidAskType, bidAskOption]);

	useEffect(() => {
		if (!isAmountError) return;
		if (bidAskAmount > 0) setIsAmountError(false);
	}, [bidAskAmount, isAmountError]);

	return (
		<div className={style['bidask-container']}>
			<Toaster />
			<BidAskType
				bidAskType={bidAskType}
				handleSetBidAskType={handleSetBidAskType}
			/>
			<div className={style['bidask-info-container']}>
				{bidAskType !== '정정/취소' && (
					<BidAskInputs
						bidAskType={bidAskType}
						bidAskOption={bidAskOption}
						bidAskPrice={bidAskPrice}
						bidAskAmount={bidAskAmount}
						isAmountError={isAmountError}
						setBidAskOption={setBidAskOption}
						setBidAskPrice={setBidAskPrice}
						setBidAskAmount={setBidAskAmount}
					/>
				)}
			</div>
			<BidAskAction
				bidAskType={bidAskType}
				isAmountError={isAmountError}
				handleReset={handleReset}
				handleBidAsk={handleBidAsk}
			/>
		</div>
	);
};

export default BidAsk;
