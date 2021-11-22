/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import { CHARTTYPE } from '@interfaces/IChartCandle';
import { Chart, ChartDays, ChartMinutes } from '@models/index';
import { ChartRepository } from '@repositories/index';
import { getConnection } from 'typeorm';

export default class ScheduleService {
	async saveCandleAndInitialize(chart: Chart, chartRepositoryRunner: ChartRepository): Promise<void> {
		switch (chart.type) {
			case CHARTTYPE.MINUTES: {
				const chartLog = new ChartMinutes({
					code: chart.stock.code,
					priceBefore: chart.priceBefore,
					priceStart: chart.priceStart,
					priceEnd: chart.priceEnd,
					priceHigh: chart.priceHigh,
					priceLow: chart.priceLow,
					amount: chart.amount,
					volume: chart.volume,
					createdAt: new Date(),
				});
				chartLog.save();
				break;
			}
			case CHARTTYPE.DAYS: {
				const chartLog = new ChartDays({
					code: chart.stock.code,
					priceBefore: chart.priceBefore,
					priceStart: chart.priceStart,
					priceEnd: chart.priceEnd,
					priceHigh: chart.priceHigh,
					priceLow: chart.priceLow,
					amount: chart.amount,
					volume: chart.volume,
					createdAt: new Date(),
				});
				chartLog.save();
				break;
			}
			default:
		}
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
		const chartRepositoryRunner = queryRunner.manager.getCustomRepository(ChartRepository);
		const charts = await chartRepositoryRunner.readLock(type);
		const chartTasks = charts.map((chart) => this.saveCandleAndInitialize(chart, chartRepositoryRunner));
		await Promise.all(chartTasks);
		await queryRunner.commitTransaction();
		await queryRunner.release();
	}
}
