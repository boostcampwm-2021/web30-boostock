import React, { ChangeEvent, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import './SignUp.scss';

const SignUp = () => {
	const { search } = useLocation();
	const query = new URLSearchParams(search);

	const [username, setUsername] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [term, setTerm] = useState<boolean>(false);
	const [result, setResult] = useState<boolean>(false);

	const changeName = (event: ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);
	const changeEmail = (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
	const changeTerm = () => setTerm((prev) => !prev);

	const submit = () => {
		const emailValidator = new RegExp('\\S+@\\S+\\.\\S+');
		if (!emailValidator.test(email)) return;

		fetch(`${process.env.SERVER_URL}/api/auth/github/signup`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({ code: query.get('code'), username, email }),
		}).then((res: Response) => {
			if (res.ok) setResult(res.ok);
		});
	};

	if (result === true) return <Redirect to="/trade" />;

	return (
		<form className="signup" action="#">
			<h1>회원가입</h1>
			<div className="signup-box">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt elementum facilisis. Duis ac ligula
				feugiat, tempor tellus sit amet, egestas turpis. Maecenas purus ipsum, porttitor at sodales quis, sollicitudin et
				ipsum. Donec eleifend et nisi non semper. Nulla id fermentum dui. Vivamus hendrerit erat luctus, tincidunt nisi
				in, finibus lacus. Aliquam sed arcu non lacus dapibus finibus sit amet sed turpis. Sed pharetra ante eget
				sollicitudin rhoncus. Integer rhoncus ligula nec congue vulputate. Aenean sed justo ac est scelerisque malesuada.
				Curabitur laoreet urna sit amet sem porta, et finibus risus convallis. Aenean vitae tortor cursus, vestibulum
				purus bibendum, efficitur nibh. Suspendisse potenti. Ut nulla elit, posuere id fermentum vitae, efficitur a nunc.
				Praesent sed mauris pharetra, suscipit magna et, ultricies ligula. Phasellus lacinia ut metus id cursus. Ut
				tincidunt luctus nisl ut auctor. Pellentesque ullamcorper orci nibh, eu gravida felis tempor a. Integer vel est a
				mauris pharetra ultrices. Sed consequat vehicula ipsum quis viverra. Phasellus vitae nisl lorem. Praesent
				dignissim blandit nunc nec consectetur. Nunc vitae metus sit amet lectus vestibulum fermentum. Sed tristique ac
				nisl a convallis. In molestie, ligula non pellentesque lobortis, orci orci volutpat neque, vitae lobortis lectus
				elit eget libero. Donec tempus finibus nulla non fringilla. Sed dapibus lacus eu nulla lacinia semper. Integer
				vitae elementum leo. Aenean neque quam, luctus eu rutrum a, ornare at nisi. Praesent ac erat ac tortor luctus
				commodo. Sed aliquet nunc quis augue finibus, venenatis dignissim nulla congue. Praesent non nisl turpis. Donec
				vel faucibus tortor. Aliquam a pulvinar risus. Nam volutpat lobortis odio, sed malesuada neque finibus vel.
				Curabitur elementum metus ut faucibus scelerisque. Nulla tortor tellus, euismod quis nisi ut, viverra fermentum
				odio. Phasellus purus magna, eleifend nec erat luctus, mattis vehicula sapien. Donec pretium velit arcu, a posuere
				justo accumsan sit amet. Nulla luctus rhoncus placerat. Cras efficitur hendrerit tellus, vitae dignissim nisl
				luctus condimentum. Aliquam id elit vitae lorem lobortis sagittis. Class aptent taciti sociosqu ad litora torquent
				per conubia nostra, per inceptos himenaeos. Nulla bibendum quis leo id feugiat. Proin id porta massa. Nunc quis
				maximus felis, auctor malesuada nisl.
			</div>

			<label className="signup-label" htmlFor="terms">
				<input type="checkbox" id="terms" name="terms" value={term ? 'on' : 'off'} onClick={changeTerm} /> 이용약관 동의
			</label>
			<div className="signup-horizontal-group">
				<label className="signup-label" htmlFor="username">
					이름
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
				<label className="signup-label" htmlFor="email">
					이메일
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
			</div>
			<input className="signup-submit" type="button" disabled={!term} onClick={submit} value="회원가입" />
		</form>
	);
};

export default SignUp;
