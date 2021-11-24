import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import StockExecution, { IStockExecutionItem } from '@recoil/stockExecution/index';
import './conclusion.scss';
import Ticks from './Ticks';
import Days from './Days';

export enum TAB {
	TICK = '체결',
	DAY = '일별',
}

interface Props {
	previousClose: number;
}

const colorPicker = (prev: number, current: number): string => {
	if (prev > current) return 'down';
	if (prev < current) return 'up';
	return '';
};

const translateTimestampFormat = (timestamp: number): string => {
	const stamp = new Date(timestamp);
	const month = `00${stamp.getMonth() + 1}`.slice(-2);
	const day = `00${stamp.getDate()}`.slice(-2);
	const hour = `00${stamp.getHours()}`.slice(-2);
	const minute = `00${stamp.getMinutes()}`.slice(-2);

	return `${month}.${day} ${hour}:${minute}`;
};

const Conclusion = ({ previousClose }: Props) => {
	const [tab, setTab] = useState(TAB.TICK);
	const stockExecutionState = useRecoilValue(StockExecution);

	const getCurrentTab = () => {
		switch (tab) {
			case TAB.TICK:
				return <Ticks key={tab} stockExecutionState={stockExecutionState} previousClose={previousClose} />;
			case TAB.DAY:
				return <Days key={tab} stockExecutionState={stockExecutionState} previousClose={previousClose} />;
			default:
				return <Ticks key={tab} stockExecutionState={stockExecutionState} previousClose={previousClose} />;
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
