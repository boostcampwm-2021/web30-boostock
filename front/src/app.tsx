import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './app.scss';
import style from './app.module.scss';

const App = () => {
	return (
		<h1 className={style.test}>
			<div> TTT </div>
			Hello World!
		</h1>
	);
};

ReactDOM.render(<App />, document.getElementById('app'));
