import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import bidAskPriceAtom from '@src/recoil/bidAskPrice/atom';
import toast, { Toaster } from 'react-hot-toast';
import BidAskType from './BidAskType';
import BidAskInputs from './BidAskInputs';
import BidAskAction from './BidAskAction';

import './bidask.scss';

interface IOrderData {
	userId: number;
	stockCode: string;
	type: number;
	option: number;
	amount: number;
	price: number;
}

const BidAsk = ({ stockCode }: { stockCode: string }) => {
	const [bidAskType, setBidAskType] = useState<string>('매수');
	const [bidAskOption, setBidAskOption] = useState<string>('지정가');
	const [bidAskPrice, setBidAskPrice] = useRecoilState(bidAskPriceAtom);
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
			userId: 1,
			stockCode,
			type: bidAskType === '매도' ? 1 : 2,
			option: bidAskOption === '지정가' ? 1 : 2,
			amount: bidAskAmount,
			price: bidAskPrice,
		};

		const config: RequestInit = {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(orderData),
		};

		try {
			const res = await fetch(`${process.env.SERVER_URL}/api/order`, config);

			if (res.status !== 200) {
				const data = await res.json();
				const error = new Error();
				error.message = data.message;
				throw error;
			}
			handleReset();
			toast.success('주문이 접수되었습니다.');
		} catch (error) {
			if (error.message === 'Not Correct Quote Digit') {
				toast.error('주문 접수에 실패했습니다. 호가 단위를 확인해주세요.', {
					style: {
						textAlign: 'center',
						maxWidth: '220px',
					},
				});
			} else if (error.message === 'Not Enough Balance') {
				toast.error('주문 접수에 실패했습니다. 잔액이 부족합니다.', {
					style: {
						textAlign: 'center',
						maxWidth: '220px',
					},
				});
			} else {
				toast.error('주문 접수에 실패했습니다. 다시 시도해 주세요.', {
					style: {
						textAlign: 'center',
						maxWidth: '236px',
					},
				});
			}
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
		<div className="bidask-container">
			<Toaster />
			<BidAskType bidAskType={bidAskType} handleSetBidAskType={handleSetBidAskType} />
			<div className="bidask-info-container">
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
