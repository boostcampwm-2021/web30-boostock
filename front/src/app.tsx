import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import TopBar from '@common/topbar/TopBar';
import './app.scss';
import HelloWorld from './HelloWorld';
import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Trade from './pages/trade/Trade';

export interface Ipage {
	id: number;
	url: string;
	component: React.FC;
}

const App = () => {
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
		<RecoilRoot>
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
		</RecoilRoot>
	);
};

ReactDOM.render(<App />, document.getElementById('app'));
