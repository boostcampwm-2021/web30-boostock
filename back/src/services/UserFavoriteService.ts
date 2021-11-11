/* eslint-disable class-methods-use-this */
import { EntityManager } from 'typeorm';
import { UserFavorite } from '@models/index';
import { UserFavoriteRepository } from '@repositories/index';
import { CommonError, CommonErrorMessage } from '@services/errors/index';

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
}
