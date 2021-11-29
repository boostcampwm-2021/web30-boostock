/* eslint-disable no-param-reassign */
import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { Chart, Stock } from '@models/index';

@EntityRepository(Chart)
export default class ChartRepository extends Repository<Chart> {
	public async readByStockIdLock(stockId: number): Promise<Chart[]> {
		return this.find({
			where: { stockId },
			relations: ['stock'],
			lock: { mode: 'pessimistic_read' },
		});
	}

	public async readByTypeLock(type: number): Promise<Chart[]> {
		return this.find({
			where: { type },
			relations: ['stock'],
			lock: { mode: 'pessimistic_read' },
		});
	}

	public async resetChart(chart: Chart): Promise<UpdateResult> {
		chart.priceBefore = chart.priceEnd;
		chart.priceStart = chart.priceEnd;
		chart.priceHigh = chart.priceEnd;
		chart.priceLow = chart.priceEnd;
		chart.amount = 0;
		chart.volume = 0;
		return this.createQueryBuilder().update(chart).where({ chartId: chart.chartId }).execute();
	}

	public async updateChart(chart: Chart, price: number, amount: number): Promise<UpdateResult> {
		chart.stock.price = price;
		if (chart.amount === 0) {
			chart.priceStart = price;
			chart.priceHigh = price;
			chart.priceLow = price;
		} else {
			chart.priceHigh = Math.max(chart.priceHigh, price);
			chart.priceLow = Math.min(chart.priceLow, price);
		}
		chart.priceEnd = price;
		chart.amount += amount;
		chart.volume += price * amount;
		return this.createQueryBuilder().update(chart).where({ chartId: chart.chartId }).execute();
	}
}
