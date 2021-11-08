import React, { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import TopBar from '@common/topbar/TopBar';
import './app.scss';
import HelloWorld from './HelloWorld';
import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Trade from './pages/trade/Trade';
import userAtom from './recoil/user/atom';
import webSocketAtom from './recoil/websocket/atom';
import { translateResponseData } from './common/utils/socketUtils';

export interface Ipage {
	id: number;
	url: string;
	title: string;
}

const App: React.FC = () => {
	const { theme } = useRecoilValue(userAtom);
	const webSocket = useRecoilValue(webSocketAtom);

	webSocket.onclose = () => {
		console.log('close app');
	};
	webSocket.onmessage = (event) => {
		console.log(translateResponseData(event.data));
	};
	webSocket.onerror = (event) => {};

	useEffect(() => {
		const $body = document.body;
		if (theme === 'light') $body.classList.remove('dark-theme');
		else $body.classList.add('dark-theme');
	}, [theme]);

	const pages: Ipage[] = [
		{
			id: 1,
			url: '/trade',
			title: 'Trade',
		},
	];

	return (
		<BrowserRouter>
			<TopBar pages={pages} />
			<main>
				<Switch>
					<Route path="/signin" component={SignIn} />
					<Route path="/signup" component={SignUp} />
					<Route path="/trade" component={Trade} />
					<Route component={HelloWorld} />
				</Switch>
			</main>
		</BrowserRouter>
	);
};

ReactDOM.render(
	<RecoilRoot>
		<App />
	</RecoilRoot>,
	document.getElementById('app'),
);
