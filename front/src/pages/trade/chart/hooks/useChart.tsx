import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { IChartItem } from '@src/types';
import chartAtom from '@recoil/chart';
import { IStockListItem, IStockChartItem } from '@recoil/stockList/index';
import { TChartType, MAX_NUM_OF_CANDLES } from '../common';
import fetchChartData from '../fetchChartData';

interface IProps {
	stockState: IStockListItem;
	stockCode: string;
	chartType: TChartType;
}

interface ISliceIndex {
	start: number;
	end: number;
	lastIndex: number;
}

const DEFAULT_START_INDEX = 0;
const DEFAULT_END_INDEX = 60;
const MIN_NUM_OF_CANDLES = 10;

const useChart = ({ stockState, stockCode, chartType }: IProps) => {
	const [chart, setChart] = useRecoilState<IChartItem[]>(chartAtom);
	const [sliceIndex, setSliceIndex] = useState<ISliceIndex>({
		start: DEFAULT_START_INDEX,
		end: DEFAULT_END_INDEX,
		lastIndex: DEFAULT_END_INDEX,
	});
	const { start, end } = sliceIndex;
	const chartToRender = chart.slice(start, end);

	const resetChart = () => {
		setChart(() => [
			{
				createdAt: Date.now(),
				priceStart: 0,
				priceEnd: 0,
				priceLow: 0,
				priceHigh: 0,
				amount: 0,
			},
		]);
	};

	const updateChartData = async (stockCode: string, chartType: TChartType, endDate?: number) => {
		const newChartData = await fetchChartData(stockCode, chartType, endDate);
		setChart((prev) => [...prev, ...newChartData]);
	};

	const updateRealtimeCandle = (charts: IStockChartItem[], chartType: TChartType) => {
		const targetChart = charts.find(({ type }) => type === chartType);
		if (!targetChart) return;

		const newChart = {
			createdAt: Date.now(),
			priceStart: targetChart.priceStart,
			priceEnd: targetChart.priceEnd,
			priceLow: targetChart.priceHigh,
			priceHigh: targetChart.priceLow,
			amount: targetChart.amount,
		};

		setChart((prev) => [newChart, ...prev.slice(1, prev.length)]);
	};

	const setSliceIndexAfterZoom = (candlesToSlide: number) => {
		setSliceIndex((prev) => {
			const { start, end, lastIndex } = prev;
			let newEnd = end + candlesToSlide;
			if (newEnd - start < MIN_NUM_OF_CANDLES) newEnd = start + MIN_NUM_OF_CANDLES;
			if (newEnd - start > MAX_NUM_OF_CANDLES) newEnd = start + MAX_NUM_OF_CANDLES;

			if (newEnd >= lastIndex) {
				updateChartData(stockCode, chartType, chart[chart.length - 1].createdAt);
				return { ...prev, end: newEnd, lastIndex: lastIndex + DEFAULT_END_INDEX * 2 };
			}

			return { ...prev, end: newEnd };
		});
	};

	const setSliceIndexAfterSlide = (moveIndex: number) => {
		setSliceIndex((prev) => {
			const { start, end, lastIndex } = prev;
			const numOfCandles = end - start;
			const newStart = start + moveIndex >= DEFAULT_START_INDEX ? start + moveIndex : DEFAULT_START_INDEX;
			const newEnd = newStart + numOfCandles;

			if (newEnd >= lastIndex) {
				updateChartData(stockCode, chartType, chart[chart.length - 1].createdAt);
				return { start: newStart, end: newEnd, lastIndex: lastIndex + DEFAULT_END_INDEX * 2 };
			}

			return {
				start: newStart >= DEFAULT_START_INDEX ? newStart : DEFAULT_START_INDEX,
				end: newEnd,
				lastIndex,
			};
		});
	};

	useEffect(() => {
		setSliceIndex({ start: DEFAULT_START_INDEX, end: DEFAULT_END_INDEX, lastIndex: DEFAULT_END_INDEX });
		resetChart();
		updateChartData(stockCode, chartType);
	}, [stockCode, chartType]);

	useEffect(() => {
		const { charts } = stockState;
		updateRealtimeCandle(charts, chartType);
	}, [stockState, chartType]);

	return {
		chart,
		chartToRender,
		setSliceIndexAfterSlide,
		setSliceIndexAfterZoom,
	};
};

export default useChart;
