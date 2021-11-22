import { EntityRepository, Repository } from 'typeorm';
import { Chart } from '@models/index';

@EntityRepository(Chart)
export default class ChartRepository extends Repository<Chart> {
	public async readLock(type: number): Promise<Chart[]> {
		return this.find({
			where: { type },
			relations: ['stock'],
			lock: { mode: 'pessimistic_write' },
		});
	}
}
