/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import IChartLog, { CHARTTYPE } from '@interfaces/IChartLog';
import { Chart, ChartLog } from '@models/index';
import { ChartRepository } from '@repositories/index';
import { getConnection } from 'typeorm';
import fetch from 'node-fetch';

export default class ScheduleService {
	reportNewChart(chartLogList: IChartLog[]): void {
		fetch(`${process.env.API_SERVER_URL}/api/stock/chart/new`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ charts: chartLogList }),
		});
	}

	async saveChartLog(chart: Chart): Promise<IChartLog> {
		const log = {
			code: chart.stock.code,
			type: chart.type,
			priceBefore: chart.priceBefore,
			priceStart: chart.priceStart,
			priceEnd: chart.priceEnd,
			priceHigh: chart.priceHigh,
			priceLow: chart.priceLow,
			amount: chart.amount,
			volume: chart.volume,
			createdAt: new Date().getTime(),
		};
		const chartLog = new ChartLog(log);
		await chartLog.save();

		return chartLog;
	}

	async initializeChart(chart: Chart, chartRepositoryRunner: ChartRepository): Promise<IChartLog> {
		const chartLog = this.saveChartLog(chart);
		chart.priceBefore = chart.priceEnd;
		chart.priceStart = 0;
		chart.priceEnd = 0;
		chart.priceHigh = 0;
		chart.priceLow = 0;
		chart.amount = 0;
		chart.volume = 0;
		await chartRepositoryRunner.save(chart);

		return chartLog;
	}

	async initializeChartAndStock(chart: Chart, chartRepositoryRunner: ChartRepository): Promise<IChartLog> {
		const chartLog = this.saveChartLog(chart);
		chart.stock.previousClose = chart.priceEnd;
		chart.priceBefore = chart.priceEnd;
		chart.priceStart = 0;
		chart.priceEnd = 0;
		chart.priceHigh = 0;
		chart.priceLow = 0;
		chart.amount = 0;
		chart.volume = 0;
		await chartRepositoryRunner.save(chart);

		return chartLog;
	}

	async runAllChart(type: number): Promise<void> {
		const queryRunner = getConnection().createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const chartRepositoryRunner = queryRunner.manager.getCustomRepository(ChartRepository);
			const charts = await chartRepositoryRunner.readLock(type);
			if (type === CHARTTYPE.DAYS) {
				const chartLogList = await Promise.all(
					charts.map((chart) => this.initializeChartAndStock(chart, chartRepositoryRunner)),
				);
				this.reportNewChart(chartLogList);
			} else {
				const chartLogList = await Promise.all(charts.map((chart) => this.initializeChart(chart, chartRepositoryRunner)));
				this.reportNewChart(chartLogList);
			}
			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release();
		}
	}
}
