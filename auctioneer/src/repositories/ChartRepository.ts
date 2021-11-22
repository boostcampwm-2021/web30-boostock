import { EntityRepository, Repository, InsertResult, UpdateResult } from 'typeorm';
import { Chart } from '@models/index';

@EntityRepository(Chart)
export default class ChartRepository extends Repository<Chart> {
	public async createChart(chart: Chart): Promise<boolean> {
		const result: InsertResult = await this.insert(chart);
		return result.identifiers.length > 0;
	}

	async updateChart(chart: Chart): Promise<boolean> {
		const result: UpdateResult = await this.update(
			{
				stockId: chart.stockId,
			},
			chart,
		);
		return result.affected != null && result.affected > 0;
	}
}
