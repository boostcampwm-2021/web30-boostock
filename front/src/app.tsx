import React, { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { RecoilRoot, useRecoilState } from 'recoil';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Flip, ToastContainer } from '@lib/toastify';
import { userAtom } from '@recoil';
import { getUserInfo } from '@lib/api';
import { MAX_NUM_OF_TOAST_MESSAGES, TOAST_AUTO_CLOSE_TIME } from '@common/constants';
import { Emitter, getCookie } from '@common/utils';
import TopBar from '@common/topbar/TopBar';
import Theme from './Theme';
import './app.scss';
import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Trade from './pages/trade/Trade';
import My from './pages/my/My';
import Balance from './pages/balance/Balance';
import Socket from './Socket';
import '@lib/toastify/ReactToastify.min.css';

export interface Ipage {
	id: number;
	url: string;
	title: string;
}

const insertDefaultChartTypeToLocalStorage = () => {
	window.localStorage.setItem('chartType', '1');
};

const App = () => {
	const [userState, setUserState] = useRecoilState(userAtom);
	const pages: Ipage[] = [];
	const { theme } = userState;

	useEffect(() => {
		(async () => {
			const userInfo = await getUserInfo();
			if (!userInfo) return;

			const { username, email } = userInfo;
			setUserState({
				...userState,
				username,
				email,
				isLoggedIn: true,
			});
			Emitter.emit('REGISTER_ALARM', getCookie('alarm_token'));
		})();
	}, []);

	useEffect(() => {
		insertDefaultChartTypeToLocalStorage();
	}, []);

	return (
		<BrowserRouter>
			<ToastContainer
				position="bottom-left"
				autoClose={TOAST_AUTO_CLOSE_TIME}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss={false}
				draggable={false}
				pauseOnHover={false}
				transition={Flip}
				limit={MAX_NUM_OF_TOAST_MESSAGES}
				theme={theme}
			/>
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
