import { useState, useEffect } from 'react';
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import ChartAtom, { IChartItem } from '@src/recoil/chart/atom';
import stockListAtom, { IStockListItem } from '@src/recoil/stockList/atom';

const reset = (set: SetterOrUpdater<IChartItem[]>) => {
	set([
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

const refreshLogChart = (code: string, type: number, offset: number, set: SetterOrUpdater<IChartItem[]>) => {
	let unit = 0;
	if (type === 1) unit = 1000 * 60 * 60;
	if (type === 1440) unit = 1000 * 60 * 60 * 24;

	const now = Date.now();
	const [start, end] = [now - unit * (offset + 1), now - unit * offset];

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

const refreshRecentChart = (code: string, type: number, stockList: IStockListItem[], set: SetterOrUpdater<IChartItem[]>) => {
	const myStock = stockList.find((stockData) => stockData.code === code);
	const myChart = myStock?.charts.find((chartData) => chartData.type === type);
	if (!myChart) return;

	const newChart = {
		createdAt: 0,
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

const next = (set: SetterOrUpdater<number>) => {
	set((prev) => prev + 1);
};

export default function useChartData(code: string, type: number): [IChartItem[], () => void] {
	const stockList = useRecoilValue(stockListAtom);
	const [chart, setChart] = useRecoilState(ChartAtom);
	const [offset, setOffset] = useState<number>(0);

	useEffect(() => {
		reset(setChart);
	}, [code, type]);

	useEffect(() => {
		refreshRecentChart(code, type, stockList, setChart);
	}, [code, type, stockList]);

	useEffect(() => {
		refreshLogChart(code, type, offset, setChart);
	}, [code, type, offset]);

	const bindedNext = next.bind(undefined, setOffset);
	return [chart, bindedNext];
}
