import React, { ChangeEvent, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Redirect, useLocation, useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import User from '@recoil/user';

import './SignUp.scss';

const SignUp = () => {
	const history = useHistory();
	const { search } = useLocation();
	const query = new URLSearchParams(search);

	const [username, setUsername] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [isEmailValidate, setEmailValidate] = useState<boolean>(false);
	const [term, setTerm] = useState<boolean>(false);
	const [userState, setUserState] = useRecoilState(User);

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
		}).then((res: Response) => {
			if (res.ok) {
				res.json().then((data) => {
					setEmailValidate(data.result);
					if (data.result === true) toast.success('사용할 수 있는 이메일입니다.');
					else toast.error('이 이메일은 사용할 수 없습니다.');
				});
			} else {
				toast.error('중복확인에 실패했습니다.');
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
				setUserState({ ...userState, isLoggedIn: true });
				history.push('/');
			} else {
				toast.error('로그인에 실패했습니다. 잠시 후 재시도 해주세요.');
			}
		});
	};

	return (
		<form className="signup" action="#">
			<Toaster />
			<div className="signup-container">
				<h1>회원가입</h1>
				<div className="signup-box">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt elementum facilisis. Duis ac ligula
					feugiat, tempor tellus sit amet, egestas turpis. Maecenas purus ipsum, porttitor at sodales quis, sollicitudin
					et ipsum. Donec eleifend et nisi non semper. Nulla id fermentum dui. Vivamus hendrerit erat luctus, tincidunt
					nisi in, finibus lacus. Aliquam sed arcu non lacus dapibus finibus sit amet sed turpis. Sed pharetra ante eget
					sollicitudin rhoncus. Integer rhoncus ligula nec congue vulputate. Aenean sed justo ac est scelerisque
					malesuada. Curabitur laoreet urna sit amet sem porta, et finibus risus convallis. Aenean vitae tortor cursus,
					vestibulum purus bibendum, efficitur nibh. Suspendisse potenti. Ut nulla elit, posuere id fermentum vitae,
					efficitur a nunc. Praesent sed mauris pharetra, suscipit magna et, ultricies ligula. Phasellus lacinia ut
					metus id cursus. Ut tincidunt luctus nisl ut auctor. Pellentesque ullamcorper orci nibh, eu gravida felis
					tempor a. Integer vel est a mauris pharetra ultrices. Sed consequat vehicula ipsum quis viverra. Phasellus
					vitae nisl lorem. Praesent dignissim blandit nunc nec consectetur. Nunc vitae metus sit amet lectus vestibulum
					fermentum. Sed tristique ac nisl a convallis. In molestie, ligula non pellentesque lobortis, orci orci
					volutpat neque, vitae lobortis lectus elit eget libero. Donec tempus finibus nulla non fringilla. Sed dapibus
					lacus eu nulla lacinia semper. Integer vitae elementum leo. Aenean neque quam, luctus eu rutrum a, ornare at
					nisi. Praesent ac erat ac tortor luctus commodo. Sed aliquet nunc quis augue finibus, venenatis dignissim
					nulla congue. Praesent non nisl turpis. Donec vel faucibus tortor. Aliquam a pulvinar risus. Nam volutpat
					lobortis odio, sed malesuada neque finibus vel. Curabitur elementum metus ut faucibus scelerisque. Nulla
					tortor tellus, euismod quis nisi ut, viverra fermentum odio. Phasellus purus magna, eleifend nec erat luctus,
					mattis vehicula sapien. Donec pretium velit arcu, a posuere justo accumsan sit amet. Nulla luctus rhoncus
					placerat. Cras efficitur hendrerit tellus, vitae dignissim nisl luctus condimentum. Aliquam id elit vitae
					lorem lobortis sagittis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
					himenaeos. Nulla bibendum quis leo id feugiat. Proin id porta massa. Nunc quis maximus felis, auctor malesuada
					nisl.
				</div>

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
