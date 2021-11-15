import React from 'react';
import * as ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import TopBar from '@common/topbar/TopBar';
import Theme from './Theme';
import './app.scss';
import HelloWorld from './HelloWorld';
import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Trade from './pages/trade/Trade';
import Socket from './Socket';

export interface Ipage {
	id: number;
	url: string;
	title: string;
}

const App: React.FC = () => {
	const pages: Ipage[] = [
		{
			id: 1,
			url: '/trade',
			title: 'Trade',
		},
	];

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
