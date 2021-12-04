import React, { useEffect, useState } from 'react';
import TOAST from '@lib/toastify';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IUser, IHoldStockItem } from '@src/types';
import { bidAskPriceAtom, userAtom } from '@recoil';
import { getUserAskAvailable, getUserBidAvailable } from '@common/utils/getAvailableAmount';
import Emitter from '@common/utils/eventEmitter';
import BidAskType from './BidAskType';
import BidAskInputs from './BidAskInputs';
import BidAskAction from './BidAskAction';

import './bidask.scss';

interface IOrderData {
	stockCode: string;
	type: number;
	option: number;
	amount: number;
	price: number;
}

const BidAsk = ({ stockCode }: { stockCode: string }) => {
	const [bidAskType, setBidAskType] = useState<string>('매수');
	const [bidAskPrice, setBidAskPrice] = useRecoilState(bidAskPriceAtom);
	const [bidAskAmount, setBidAskAmount] = useState<number>(0);
	const [isAmountError, setIsAmountError] = useState<boolean>(false);
	const [bidAvailable, setBidAvailable] = useState<number>(0);
	const [askAvailable, setAskAvailable] = useState<number>(0);
	const { isLoggedIn } = useRecoilValue<IUser>(userAtom);

	const handleSetBidAskType = (newType: string) => setBidAskType(newType);

	const setUserAvailableAmount = async (code: string, isSignedIn: boolean, askAvailable: number | null = null) => {
		setBidAvailable(await getUserBidAvailable(isSignedIn));
		if (askAvailable) {
			setAskAvailable(askAvailable);
			return;
		}
		setAskAvailable(await getUserAskAvailable(code, isSignedIn));
	};

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
			stockCode,
			type: bidAskType === '매도' ? 1 : 2,
			option: 1,
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
			const res = await fetch(`${process.env.SERVER_URL}/api/user/order`, config);

			if (!res.ok) {
				const data = await res.json();
				const error = new Error();
				error.message = data.message;
				throw error;
			}
			handleReset();
			await setUserAvailableAmount(stockCode, isLoggedIn);
			TOAST.success('주문이 접수되었습니다.');
		} catch (error) {
			if (error.message === 'Not Correct Quote Digit') {
				TOAST.error('주문 접수에 실패했습니다. 호가 단위를 확인해주세요.', {
					style: {
						textAlign: 'center',
						maxWidth: '220px',
					},
				});
			} else if (error.message === 'Not Enough Balance') {
				TOAST.error('주문 접수에 실패했습니다. 잔액이 부족합니다.', {
					style: {
						textAlign: 'center',
						maxWidth: '220px',
					},
				});
			} else {
				TOAST.error('주문 접수에 실패했습니다. 다시 시도해 주세요.', {
					style: {
						textAlign: 'center',
						maxWidth: '236px',
					},
				});
			}
		}
	};

	useEffect(() => {
		const listener = async (stockCode: string, holdStockList: IHoldStockItem[]) => {
			const [holdStock] = holdStockList.filter(({ code }) => code === stockCode);
			setUserAvailableAmount('', isLoggedIn, holdStock?.amount ?? 0);
		};

		Emitter.on('CONCLUDED_ORDER', listener);

		return () => {
			Emitter.off('CONCLUDED_ORDER', listener);
		};
	}, [isLoggedIn]);

	useEffect(() => {
		handleReset();
	}, [bidAskType]);

	useEffect(() => {
		if (!isAmountError) return;
		if (bidAskAmount > 0) setIsAmountError(false);
	}, [bidAskAmount, isAmountError]);

	useEffect(() => {
		if (!stockCode) return;
		(async () => {
			await setUserAvailableAmount(stockCode, isLoggedIn);
		})();
	}, [stockCode, isLoggedIn]);

	return (
		<div className="bidask-container">
			<BidAskType bidAskType={bidAskType} handleSetBidAskType={handleSetBidAskType} />
			<div className="bidask-info-container">
				<BidAskInputs
					bidAskType={bidAskType}
					bidAskPrice={bidAskPrice}
					bidAskAmount={bidAskAmount}
					isAmountError={isAmountError}
					askAvailable={askAvailable}
					bidAvailable={bidAvailable}
					stockCode={stockCode}
					setBidAskPrice={setBidAskPrice}
					setBidAskAmount={setBidAskAmount}
				/>
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
