import React, { useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
import ChartAtom from '@src/recoil/chart/atom';

import CandleGraph from './CandleGraph';
import CandleLegend from './CandleLegend';
import VolumeGraph from './VolumeGraph';
import VolumeLegend from './VolumeLegend';
import PeriodLegend from './PeriodLegend';

import './Chart.scss';

const NUM_OF_CANDLES = 60;

const Chart = () => {
	const [chart, setChart] = useRecoilState(ChartAtom);
	const [start, setStart] = useState<number>(0); // 맨 오른쪽 캔들의 인덱스
	const [end, setEnd] = useState<number>(60); // 맨 왼쪽 캔들의 인덱스

	return (
		<div className="chart-container">
			<PeriodLegend chartData={chart.slice(start, end + 1)} />
			<CandleLegend chartData={chart.slice(start, end + 1)} />
			<VolumeLegend chartData={chart.slice(start, end + 1)} />
			<CandleGraph chartData={chart.slice(start, end + 1)} numOfCandles={NUM_OF_CANDLES} />
			<VolumeGraph chartData={chart.slice(start, end + 1)} />
			<div className="chart-menu" />
		</div>
	);
};

export default Chart;
