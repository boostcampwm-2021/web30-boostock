import React, { useState } from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';

import './SignIn.scss';

const SignIn = () => {
	const { pathname, search } = useLocation();
	const query = new URLSearchParams(search);
	const [result, setResult] = useState<boolean>(false);

	const isSignUp = pathname === '/auth/signup';

	const TEXT = isSignUp ? '회원가입' : '로그인';
	const SWITCH_URL = isSignUp ? '/auth/signin' : '/auth/signup';
	const SWITCH_TEXT = isSignUp ? '기존 계정으로 로그인' : '새로운 계정으로 회원가입';

	if (query.get('code')) {
		console.log(JSON.stringify({ code: query.get('code') }));
		fetch(`${process.env.SERVER_URL}/api/auth/github/signin`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({ code: query.get('code') }),
		}).then((res: Response) => {
			setResult(res.ok);
		});
	}

	console.log(result);
	if (result === true) return <Redirect to="/trade" />;

	return (
		<div className="signin">
			<h1>{TEXT}</h1>
			<a
				className="signin-button github-type"
				href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT}&redirect_uri=${window.location.href}/callback`}
			>
				Github로 {TEXT}
			</a>
			<div className="signin-hr">
				<div className="signin-hr-line" />
				<span>또는</span>
				<div className="signin-hr-line" />
			</div>
			<Link className="signin-button signup-type" to={SWITCH_URL}>
				{SWITCH_TEXT}
			</Link>
		</div>
	);
};

export default SignIn;
