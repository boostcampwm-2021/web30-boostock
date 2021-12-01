import React from 'react';
import { useHistory } from 'react-router-dom';
import { GrPowerReset } from 'react-icons/gr';
import { useRecoilValue } from 'recoil';
import { IUser } from '@src/types';
import userAtom from '@recoil/user';

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

	return result;
}

const BidAskAction = ({ bidAskType, isAmountError, handleReset, handleBidAsk }: IProps) => {
	const history = useHistory();
	const { isLoggedIn } = useRecoilValue<IUser>(userAtom);

	const handleRedirectToSignUpPage = () => {
		history.push('/auth/signup');
	};

	const handleRedirectToSignInPage = () => {
		history.push('/auth/signin');
	};

	const guestContent = (
		<>
			<button type="button" className="bidask-reset-btn signup-action" onClick={handleRedirectToSignUpPage}>
				회원가입
			</button>
			<button type="button" className="bidask-action-btn signin-action" onClick={handleRedirectToSignInPage}>
				로그인
			</button>
		</>
	);

	const authContent = (
		<>
			<button onClick={handleReset} className="bidask-reset-btn" type="button">
				<span className="bidask-action-reset-icon">
					<GrPowerReset />
				</span>
				초기화
			</button>
			<button className={orderActionClass(bidAskType)} type="button" onClick={handleBidAsk} disabled={isAmountError}>
				{bidAskType}
			</button>
		</>
	);

	return <div className="bidask-action-container">{isLoggedIn ? authContent : guestContent}</div>;
};

export default BidAskAction;
