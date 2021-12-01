/* eslint-disable class-methods-use-this */
import { getCustomRepository } from 'typeorm';
import { Stock, UserFavorite } from '@models/index';
import { StockRepository, UserFavoriteRepository, UserRepository } from '@repositories/index';
import { ParamError, ParamErrorMessage } from '@errors/index';

export default class UserFavoriteService {
	static instance: UserFavoriteService | null = null;

	constructor() {
		if (UserFavoriteService.instance) return UserFavoriteService.instance;
		UserFavoriteService.instance = this;
	}

	static async readByUserId(userId: number): Promise<Stock[]> {
		const userFavorites = await getCustomRepository(UserFavoriteRepository).readByUserId(userId);
		return userFavorites.map((userFavorite) => userFavorite.stockId);
	}

	static async createUserFavorite(userId: number, stockCode: string): Promise<void> {
		const targetUser = await getCustomRepository(UserRepository).findOne(userId);
		const targetStock = await getCustomRepository(StockRepository).findOne({ where: { code: stockCode } });
		if (targetUser === undefined || targetStock === undefined) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
		const newFavorite = new UserFavorite();
		newFavorite.userId = targetUser;
		newFavorite.stockId = targetStock;
		await getCustomRepository(UserFavoriteRepository).save(newFavorite);
	}

	static async removeUserFavorite(userId: number, stockCode: string): Promise<void> {
		const userFavoriteRepository = getCustomRepository(UserFavoriteRepository);
		const targetStock = await getCustomRepository(StockRepository).findOne({ where: { code: stockCode } });
		if (targetStock === undefined) throw new ParamError(ParamErrorMessage.INVALID_PARAM);
		await userFavoriteRepository.deleteByUserIdStock(userId, targetStock);
	}
}
