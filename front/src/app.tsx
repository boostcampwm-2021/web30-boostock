import React, { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { RecoilRoot, useRecoilState } from 'recoil';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import User from '@recoil/user/index';
import TopBar from '@common/topbar/TopBar';
import Theme from './Theme';
import './app.scss';
import HelloWorld from './HelloWorld';
import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Trade from './pages/trade/Trade';
import My from './pages/my/My';
import Balance from './pages/balance/Balance';
import Socket from './Socket';

export interface Ipage {
	id: number;
	url: string;
	title: string;
}

const App: React.FC = () => {
	const [userState, setUserState] = useRecoilState(User);
	const pages: Ipage[] = [
		{
			id: 1,
			url: '/trade',
			title: 'Trade',
		},
	];

	useEffect(() => {
		fetch(`${process.env.SERVER_URL}/api/user`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		}).then((res: Response) => {
			if (res.ok) {
				setUserState({ ...userState, isLoggedIn: true });
			}
		});
	}, []);

	return (
		<BrowserRouter>
			<Socket>
				<Theme>
					<TopBar pages={pages} />
					<Switch>
						<Route exact path="/auth/signin" component={SignIn} />
						<Route exact path="/auth/signin/callback" component={SignIn} />
						<Route exact path="/auth/signup" component={SignIn} />
						<Route exact path="/auth/signup/callback" component={SignUp} />
						<Route exact path="/my" component={My} />
						<Route exact path="/balance" component={Balance} />
						<Route path="/trade" component={Trade} />
						<Route component={HelloWorld} />
					</Switch>
				</Theme>
			</Socket>
		</BrowserRouter>
	);
};

ReactDOM.render(
	<RecoilRoot>
		<App />
	</RecoilRoot>,
	document.getElementById('app'),
);
