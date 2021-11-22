/* eslint-disable class-methods-use-this */
import { EntityManager, getCustomRepository } from 'typeorm';
import { Stock, UserFavorite } from '@models/index';
import { StockRepository, UserFavoriteRepository, UserRepository } from '@repositories/index';
import { CommonError, CommonErrorMessage, ParamError, ParamErrorMessage } from 'errors/index';

export default class UserFavoriteService {
	static instance: UserFavoriteService | null = null;

	constructor() {
		if (UserFavoriteService.instance) return UserFavoriteService.instance;
		UserFavoriteService.instance = this;
	}

	private getUserFavoriteRepository(entityManager: EntityManager): UserFavoriteRepository {
		const userFavoriteRepository: UserFavoriteRepository | null = entityManager.getCustomRepository(UserFavoriteRepository);

		if (!entityManager || !userFavoriteRepository) throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return userFavoriteRepository;
	}

	static async getUserFavoriteByUserId(userId: number): Promise<Stock[]> {
		const userFavorites = await getCustomRepository(UserFavoriteRepository).readUserFavoriteById(userId);
		return userFavorites.map((userFavorite) => userFavorite.stockId);
	}

	static async createUserFavorite(userId: number, stockId: number): Promise<UserFavorite> {
		const targetUser = await getCustomRepository(UserRepository).findOne(userId);
		const targetStock = await getCustomRepository(StockRepository).findOne(stockId);
		if (targetUser === undefined || targetStock === undefined) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
		const newFavorite = new UserFavorite();
		newFavorite.userId = targetUser;
		newFavorite.stockId = targetStock;
		return getCustomRepository(UserFavoriteRepository).save(newFavorite);
	}

	static async removeUserFavorite(userId: number, stockId: number): Promise<UserFavorite> {
		const userFavoriteRepository = getCustomRepository(UserFavoriteRepository);
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
