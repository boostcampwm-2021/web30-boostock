import React, { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { RecoilRoot, useRecoilState } from 'recoil';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import User from '@recoil/user';
import TopBar from '@common/topbar/TopBar';
import Theme from './Theme';
import './app.scss';
import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Trade from './pages/trade/Trade';
import My from './pages/my/My';
import Balance from './pages/balance/Balance';
import Socket from './Socket';
import eventEmitter from './common/utils/eventEmitter';
import { getCookie } from './common/utils/cookie';

export interface Ipage {
	id: number;
	url: string;
	title: string;
}

const App: React.FC = () => {
	const [userState, setUserState] = useRecoilState(User);
	const pages: Ipage[] = [];

	useEffect(() => {
		fetch(`${process.env.SERVER_URL}/api/user`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		}).then((res: Response) => {
			if (res.ok) {
				res.json().then((data) => {
					setUserState({
						...userState,
						username: data.user.username,
						email: data.user.email,
						isLoggedIn: true,
					});
					eventEmitter.emit('REGISTER_ALARM', getCookie('alarm_token'));
				});
			}
		});
	}, []);

	return (
		<BrowserRouter>
			<Toaster position="bottom-left" reverseOrder={false} />
			<Theme>
				<TopBar pages={pages} />
				<Switch>
					<Route exact path="/auth/signin" component={SignIn} />
					<Route exact path="/auth/signin/callback" component={SignIn} />
					<Route exact path="/auth/signup" component={SignIn} />
					<Route exact path="/auth/signup/callback" component={SignUp} />
					<Route exact path="/my" component={My} />
					<Route exact path="/balance" component={Balance} />
					<Route path="/" component={Trade} />
				</Switch>
			</Theme>
		</BrowserRouter>
	);
};

ReactDOM.render(
	<RecoilRoot>
		<Socket>
			<App />
		</Socket>
	</RecoilRoot>,
	document.getElementById('app'),
);
