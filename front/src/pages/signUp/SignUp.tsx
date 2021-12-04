import React, { ChangeEvent, useState } from 'react';
import TOAST from '@lib/toastify';
import { Redirect, useLocation, useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { IUser } from '@src/types';
import { userAtom } from '@recoil';
import { Emitter, getCookie } from '@common/utils';
import Terms from './Terms';
import './SignUp.scss';

const SignUp = () => {
	const history = useHistory();
	const { search } = useLocation();
	const query = new URLSearchParams(search);

	const [username, setUsername] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [isEmailValidate, setEmailValidate] = useState<boolean>(false);
	const [term, setTerm] = useState<boolean>(false);
	const [userState, setUserState] = useRecoilState<IUser>(userAtom);

	if (userState.isLoggedIn) {
		return <Redirect to="/" />;
	}

	const emailValidator = new RegExp('\\S+@\\S+\\.\\S+');

	const changeName = (event: ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);
	const changeEmail = (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
	const changeTerm = () => setTerm((prev) => !prev);

	const isValid = () => username.length > 0 && emailValidator.test(email) && isEmailValidate && term;

	const checkEamil = () => {
		fetch(`${process.env.SERVER_URL}/api/user/email?email=${email}`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
		}).then(async (res: Response) => {
			const data = await res.json();
			if (res.ok) {
				setEmailValidate(true);
				TOAST.success('사용할 수 있는 이메일입니다.');
			} else {
				setEmailValidate(false);
				if (data.message === 'EXIST USER') TOAST.error('중복된 이메일입니다.');
				else if (data.message === 'INVALID PARAM') TOAST.error('사용할 수 없는 이메일입니다.');
				else TOAST.error('중복확인에 실패했습니다.');
			}
		});
	};

	const submit = () => {
		if (!emailValidator.test(email)) return;

		fetch(`${process.env.SERVER_URL}/api/auth/github/signup`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({ code: query.get('code'), username, email }),
		}).then((res: Response) => {
			if (res.ok) {
				Emitter.emit('REGISTER_ALARM', getCookie('alarm_token'));
				setUserState({ ...userState, isLoggedIn: true });
				TOAST.success('성공적으로 회원가입 되었습니다.');
				history.push('/');
			} else {
				TOAST.error('회원가입에 실패했습니다. 잠시 후 재시도 해주세요.');
			}
		});
	};

	return (
		<form className="signup" action="#">
			<div className="signup-container">
				<h1>회원가입</h1>
				<Terms />
				<label className="signup-label" htmlFor="terms">
					<input type="checkbox" id="terms" name="terms" value={term ? 'on' : 'off'} onClick={changeTerm} /> 이용약관
					동의
				</label>
				<label className="signup-label" htmlFor="username">
					<span>이름</span>
					<input
						className="signup-input"
						type="text"
						id="username"
						name="username"
						maxLength={50}
						value={username}
						onChange={changeName}
					/>
				</label>
				<div className="signup-horizontal-group">
					<label className="signup-label" htmlFor="email">
						<span>이메일</span>
						<input
							className="signup-input"
							type="email"
							id="email"
							name="email"
							maxLength={100}
							value={email}
							onChange={changeEmail}
						/>
					</label>
					<button className="signup-submit signup-submit-validate" type="button" tabIndex={0} onClick={checkEamil}>
						중복확인
					</button>
				</div>
				<input className="signup-submit" type="button" disabled={!isValid()} onClick={submit} value="회원가입" />
			</div>
		</form>
	);
};

export default SignUp;
