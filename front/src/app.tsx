import React, { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { RecoilRoot, useRecoilState } from 'recoil';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import User from '@recoil/user/index';
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

const TOAST_LIMIT = 3;

const App: React.FC = () => {
	const { toasts } = useToasterStore();
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
					eventEmitter.emit('registerAlarm', getCookie('alarmToken'));
				});
			}
		});
	}, []);

	useEffect(() => {
		toasts
			.filter((t) => t.visible) // Only consider visible toasts
			.filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit
			.forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) removal without animation
	}, [toasts]);

	return (
		<BrowserRouter>
			<Toaster />
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
