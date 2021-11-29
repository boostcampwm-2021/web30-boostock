import { useEffect } from 'react';
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import ChartAtom, { IChartItem } from '@src/recoil/chart/atom';
import stockListAtom, { IStockListItem } from '@src/recoil/stockList/atom';
import { TChartType } from './common';

const reset = (set: SetterOrUpdater<IChartItem[]>) => {
	set(() => [
		{
			createdAt: 0,
			priceStart: 0,
			priceEnd: 0,
			priceLow: 0,
			priceHigh: 0,
			amount: 0,
		},
	]);
};

const refreshLogChart = (code: string, type: TChartType, offset: number, set: SetterOrUpdater<IChartItem[]>) => {
	let unit = 0;
	if (type === 1) unit = 1000 * 60 * 60;
	if (type === 1440) unit = 1000 * 60 * 60 * 24;

	const now = Date.now();
	const [start, end] = [now - unit * (offset + 2), now - unit * offset];

	fetch(`${process.env.SERVER_URL}/api/stock/log?code=${code}&type=${type}&start=${start}&end=${end}`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	}).then((res: Response) => {
		if (res.ok) {
			res.json().then((data) => {
				set((prev) => {
					return [...prev, ...data.log.reverse()];
				});
			});
		}
	});
};

const refreshRecentChart = (code: string, type: TChartType, stockList: IStockListItem[], set: SetterOrUpdater<IChartItem[]>) => {
	const myStock = stockList.find((stockData) => stockData.code === code);
	const myChart = myStock?.charts.find((chartData) => chartData.type === type);
	if (!myChart) return;

	const newChart = {
		createdAt: Date.now(),
		priceStart: myChart.priceStart,
		priceEnd: myChart.priceEnd,
		priceLow: myChart.priceHigh,
		priceHigh: myChart.priceLow,
		amount: myChart.amount,
	};

	set((prev: IChartItem[]) => {
		return [newChart, ...prev.slice(1, prev.length)];
	});
};

export default function useChartData(code: string, type: TChartType, index: number): IChartItem[] {
	const stockList = useRecoilValue(stockListAtom);
	const [chart, setChart] = useRecoilState(ChartAtom);

	useEffect(() => {
		refreshRecentChart(code, type, stockList, setChart);
	}, [stockList]);

	useEffect(() => {
		if (index !== 0) {
			refreshLogChart(code, type, index, setChart);
		}
	}, [index]);

	useEffect(() => {
		if (index === 0) {
			reset(setChart);
			refreshRecentChart(code, type, stockList, setChart);
			refreshLogChart(code, type, index, setChart);
		}
	}, [code, type, index]);

	return chart;
}
