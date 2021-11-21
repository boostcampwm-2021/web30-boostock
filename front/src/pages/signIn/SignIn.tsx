import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import toast, { Toaster } from 'react-hot-toast';
import { Link, Redirect, useLocation } from 'react-router-dom';

import User from '@recoil/user/index';

import './SignIn.scss';

const SignIn = () => {
	const { pathname, search } = useLocation();
	const query = new URLSearchParams(search);
	const [userState, setUserState] = useRecoilState(User);
	const [result, setResult] = useState<boolean>(false);

	const isSignUp = pathname === '/auth/signup';

	const TEXT = isSignUp ? '회원가입' : '로그인';
	const SWITCH_URL = isSignUp ? '/auth/signin' : '/auth/signup';
	const SWITCH_TEXT = isSignUp ? '기존 계정으로 로그인' : '새로운 계정으로 회원가입';

	if (query.get('code') && result === false) {
		fetch(`${process.env.SERVER_URL}/api/auth/github/signin`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({ code: query.get('code') }),
		}).then(async (res: Response) => {
			if (res.ok) {
				setUserState({ ...userState, isLoggedIn: true });
				setResult(true);
			} else {
				toast.error('로그인에 실패했습니다. 잠시 후 재시도 해주세요.');
			}
		});
	}

	if (result === true) return <Redirect to="/trade" />;

	return (
		<div className="signin">
			<Toaster />
			<h1 className="sign-page-header">{TEXT}</h1>
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
