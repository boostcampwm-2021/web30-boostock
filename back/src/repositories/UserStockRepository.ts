import { EntityRepository, Repository } from 'typeorm';
import UserStock from '@models/UserStock';
import ILockVersion from '@interfaces/ILockVersion';
import { DBError, DBErrorMessage } from '@errors/index';

@EntityRepository(UserStock)
export default class UserStockRepository extends Repository<UserStock> {
	async insertQueryRunner(value): Promise<boolean> {
		const { identifiers } = await this.createQueryBuilder().insert().into(UserStock).values(value).execute();
		return identifiers.length === 1;
	}

	async read(userId: number, stockId: number): Promise<UserStock | undefined> {
		return this.createQueryBuilder()
			.where('UserStock.userId = :userId', { userId })
			.andWhere('UserStock.stockId = :stockId', { stockId })
			.getOne();
	}

	async readLock(userStockId: number, lock: ILockVersion): Promise<UserStock> {
		return this.createQueryBuilder()
			.where('UserStock.userStockId = :userStockId', { userStockId })
			.setLock(lock)
			.getOneOrFail();
	}

	async updateQueryRunner(userStock: UserStock): Promise<void> {
		const { affected } = await this.createQueryBuilder().update().set(userStock).whereInIds(userStock.userStockId).execute();
		if (affected !== 1) throw new DBError(DBErrorMessage.UPDATE_FAIL);
	}

	async deleteQueryRunner(userStockId: number): Promise<void> {
		const { affected } = await this.createQueryBuilder().delete().whereInIds(userStockId).execute();
		if (affected !== 1) throw new DBError(DBErrorMessage.UPDATE_FAIL);
	}
}
