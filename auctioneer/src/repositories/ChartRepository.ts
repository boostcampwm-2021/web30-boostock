import {
	EntityRepository,
	Repository,
	InsertResult,
	UpdateResult,
	DeleteResult,
} from 'typeorm';
import { Chart } from '@models/index';

@EntityRepository(Chart)
export default class ChartRepository extends Repository<Chart> {
	public async createChart(chart: Chart): Promise<boolean> {
		const result: InsertResult = await this.insert(chart);
		return result.identifiers.length > 0;
	}

	// public async readChartByCodeAndType(code: string, type: ChartType): Promise<Chart | underfined> {
	// 	await this.findOne({ where: {
	// 		code,
	// 		type
	// 	}})
	// }

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
