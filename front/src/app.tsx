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

export interface Ipage {
	id: number;
	url: string;
	component: React.FC;
}

const App = () => {
	const { theme } = useRecoilValue(userAtom);

	useEffect(() => {
		const $body = document.body;
		if (theme === 'light') $body.classList.remove('dark-theme');
		else $body.classList.add('dark-theme');
	}, [theme]);

	const pages: Ipage[] = [
		{
			id: 1,
			url: '/home',
			component: HelloWorld,
		},
		{
			id: 2,
			url: '/mypage',
			component: HelloWorld,
		},
	];

	return (
		<BrowserRouter>
			<TopBar pages={pages} />
			<main>
				<Switch>
					{pages.map((page) => (
						<Route
							path={page.url}
							component={page.component}
							key={page.id}
						/>
					))}
					<Route path="/signin" component={SignIn} />
					<Route path="/signup" component={SignUp} />
					<Route
						path="/exchange/:stockName"
						component={Trade}
						exact
					/>
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
