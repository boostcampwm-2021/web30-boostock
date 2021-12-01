/* eslint-disable no-param-reassign */
import { EntityRepository, Repository } from 'typeorm';
import { Chart } from '@models/index';
import ILockVersion from '@interfaces/ILockVersion';
import { DBError, DBErrorMessage } from '@errors/index';

@EntityRepository(Chart)
export default class ChartRepository extends Repository<Chart> {
	public async readByStockIdLock(stockId: number, lock: ILockVersion): Promise<Chart[]> {
		return this.find({
			where: { stockId },
			relations: ['stock'],
			lock: { mode: lock },
		});
	}

	public async readByTypeLock(type: number, lock: ILockVersion): Promise<Chart[]> {
		return this.find({
			where: { type },
			relations: ['stock'],
			lock: { mode: lock },
		});
	}

	public async resetChart(chart: Chart): Promise<void> {
		chart.priceBefore = chart.priceEnd;
		chart.priceStart = chart.priceEnd;
		chart.priceHigh = chart.priceEnd;
		chart.priceLow = chart.priceEnd;
		chart.amount = 0;
		chart.volume = 0;
		const { affected } = await this.createQueryBuilder().update(chart).where({ chartId: chart.chartId }).execute();
		if (affected !== 1) throw new DBError(DBErrorMessage.UPDATE_FAIL);
	}

	public async updateChart(chart: Chart, price: number, amount: number): Promise<void> {
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
		const { affected } = await this.createQueryBuilder().update(chart).where({ chartId: chart.chartId }).execute();
		if (affected !== 1) throw new DBError(DBErrorMessage.UPDATE_FAIL);
	}
}
