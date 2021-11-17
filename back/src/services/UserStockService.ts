/* eslint-disable class-methods-use-this */
import { EntityManager, getCustomRepository } from 'typeorm';
import { UserStock } from '@models/index';
import { StockRepository, UserRepository, UserStockRepository } from '@repositories/index';
import {
	CommonError,
	CommonErrorMessage,
	ParamError,
	ParamErrorMessage,
	UserError,
	UserErrorMessage,
} from '@services/errors/index';

export default class UserStockService {
	static instance: UserStockService | null = null;

	constructor() {
		if (UserStockService.instance) return UserStockService.instance;
		UserStockService.instance = this;
	}

	private getUserStockRepository(entityManager: EntityManager): UserStockRepository {
		const userStockRepository: UserStockRepository | null = entityManager.getCustomRepository(UserStockRepository);

		if (!entityManager || !userStockRepository) throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return userStockRepository;
	}

	public async setAmount(entityManager: EntityManager, id: number, amount: number): Promise<boolean> {
		if (!Number.isInteger(id) || !Number.isInteger(amount)) throw new CommonError(CommonErrorMessage.INVALID_REQUEST);

		const userStockRepository: UserStockRepository = this.getUserStockRepository(entityManager);

		const userStockEntity: UserStock = userStockRepository.create({
			userStockId: id,
			amount,
		});

		const result: boolean = await userStockRepository.updateUserStock(userStockEntity);
		if (!result) throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return result;
	}

	static async createOrUpdate(
		userId: number,
		stockId: number,
		amount: number | undefined,
		average: number | undefined,
	): Promise<UserStock> {
		const userStockRepository = getCustomRepository(UserStockRepository);
		let targetUserStock = await userStockRepository.findOne({ where: { userId, stockId } });
		if (targetUserStock === undefined) {
			targetUserStock = userStockRepository.create({
				userId,
				stockId,
			});
		}
		targetUserStock.amount = amount || 0;
		targetUserStock.average = average || 0;
		return userStockRepository.save(targetUserStock);
	}

	static async readUserStockWithStockInfo(userId: number): Promise<UserStock[]> {
		const userStockRepository = getCustomRepository(UserStockRepository);
		return userStockRepository.find({ where: { userId }, relations: ['stock'] });
	}

	static async createUserStock(userId: number, stockId: number, amount: number, average: number): Promise<UserStock> {
		const targetUser = await getCustomRepository(UserRepository).findOne(userId);
		const targetStock = await getCustomRepository(StockRepository).findOne(stockId);
		if (targetUser === undefined || targetStock === undefined) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
		const newUserStock = new UserStock();
		newUserStock.user = targetUser;
		newUserStock.stock = targetStock;
		newUserStock.average = average;
		newUserStock.amount = amount;
		return getCustomRepository(UserStockRepository).save(newUserStock);
	}

	static async removeUserStock(userId: number, stockId: number): Promise<UserStock> {
		const userFavoriteRepository = getCustomRepository(UserStockRepository);
		const targetFavorite = await userFavoriteRepository.findOne({
			where: {
				userId,
				stockId,
			},
		});
		if (targetFavorite === undefined) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
		return userFavoriteRepository.remove(targetFavorite);
	}
}
