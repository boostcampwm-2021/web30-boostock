/* eslint-disable class-methods-use-this */
import { EntityManager } from 'typeorm';
import { UserStock } from '@models/index';
import { UserStockRepository } from '@repositories/index';
import { CommonError, CommonErrorMessage } from '@services/errors/index';

export default class UserStockService {
	static instance: UserStockService | null = null;

	constructor() {
		if (UserStockService.instance) return UserStockService.instance;
		UserStockService.instance = this;
	}

	private getUserStockRepository(
		entityManager: EntityManager,
	): UserStockRepository {
		const userStockRepository: UserStockRepository | null =
			entityManager.getCustomRepository(UserStockRepository);

		if (!entityManager || !userStockRepository)
			throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return userStockRepository;
	}

	public async setAmount(
		entityManager: EntityManager,
		id: number,
		amount: number,
	): Promise<boolean> {
		if (!Number.isInteger(id) || !Number.isInteger(amount))
			throw new CommonError(CommonErrorMessage.INVALID_REQUEST);

		const userStockRepository: UserStockRepository =
			this.getUserStockRepository(entityManager);

		const userStockEntity: UserStock = userStockRepository.create({
			user_stock_id: id,
			amount,
		});

		const result: boolean = await userStockRepository.updateUserStock(
			userStockEntity,
		);
		if (!result) throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return result;
	}
}
