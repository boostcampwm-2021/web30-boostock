/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import { CHARTTYPE } from '@interfaces/IChartCandle';
import { Chart, ChartDays, ChartMinutes } from '@models/index';
import { ChartRepository } from '@repositories/index';
import { getConnection } from 'typeorm';

export default class ScheduleService {
	async saveChartLog(chart: Chart): Promise<void> {
		const log = {
			code: chart.stock.code,
			priceBefore: chart.priceBefore,
			priceStart: chart.priceStart,
			priceEnd: chart.priceEnd,
			priceHigh: chart.priceHigh,
			priceLow: chart.priceLow,
			amount: chart.amount,
			volume: chart.volume,
			createdAt: new Date(),
		};
		switch (chart.type) {
			case CHARTTYPE.MINUTES: {
				const chartLog = new ChartMinutes(log);
				await chartLog.save();
				break;
			}
			case CHARTTYPE.DAYS: {
				const chartLog = new ChartDays(log);
				await chartLog.save();
				break;
			}
			default:
		}
	}

	async initializeChart(chart: Chart, chartRepositoryRunner: ChartRepository): Promise<void> {
		this.saveChartLog(chart);
		chart.priceBefore = chart.priceEnd;
		chart.priceStart = 0;
		chart.priceEnd = 0;
		chart.priceHigh = 0;
		chart.priceLow = 0;
		chart.amount = 0;
		chart.volume = 0;
		await chartRepositoryRunner.save(chart);
	}

	async initializeChartAndStock(chart: Chart, chartRepositoryRunner: ChartRepository): Promise<void> {
		this.saveChartLog(chart);
		chart.stock.previousClose = chart.priceEnd;
		chart.priceBefore = chart.priceEnd;
		chart.priceStart = 0;
		chart.priceEnd = 0;
		chart.priceHigh = 0;
		chart.priceLow = 0;
		chart.amount = 0;
		chart.volume = 0;
		await chartRepositoryRunner.save(chart);
	}

	async runAllChart(type: number): Promise<void> {
		const queryRunner = getConnection().createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const chartRepositoryRunner = queryRunner.manager.getCustomRepository(ChartRepository);
			const charts = await chartRepositoryRunner.readLock(type);
			if (type === CHARTTYPE.DAYS) {
				await Promise.all(charts.map((chart) => this.initializeChartAndStock(chart, chartRepositoryRunner)));
			} else {
				await Promise.all(charts.map((chart) => this.initializeChart(chart, chartRepositoryRunner)));
			}
			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release();
		}
	}
}
