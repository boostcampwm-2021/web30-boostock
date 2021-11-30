import React, { useState } from 'react';

import './conclusion.scss';
import Ticks from './Ticks';
import Days from './Days';

export enum TAB {
	TICK = '체결',
	DAY = '일별',
}

interface Props {
	stockCode: string;
	previousClose: number;
}

const Conclusion = ({ previousClose, stockCode }: Props) => {
	const [tab, setTab] = useState(TAB.TICK);

	const getCurrentTab = () => {
		switch (tab) {
			case TAB.TICK:
				return <Ticks key={tab} previousClose={previousClose} />;
			case TAB.DAY:
				return <Days key={tab} stockCode={stockCode} />;
			default:
				return <Ticks key={tab} previousClose={previousClose} />;
		}
	};

	return (
		<div className="conclusion-container">
			<div className="conclusion-title">
				<button
					type="button"
					className={`conclusion-tab ${tab === TAB.TICK ? 'conclusion-tab-clicked' : ''}`}
					onClick={() => setTab(TAB.TICK)}
				>
					체결
				</button>
				<button
					type="button"
					className={`conclusion-tab ${tab === TAB.DAY ? 'conclusion-tab-clicked' : ''}`}
					onClick={() => setTab(TAB.DAY)}
				>
					일별
				</button>
			</div>
			{getCurrentTab()}
		</div>
	);
};

export default Conclusion;
