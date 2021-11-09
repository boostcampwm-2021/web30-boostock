/* eslint-disable class-methods-use-this */
import { EntityManager } from 'typeorm';
import { User } from '@models/index';
import { UserRepository } from '@repositories/index';
import {
	CommonError,
	CommonErrorMessage,
	UserError,
	UserErrorMessage,
} from '@services/errors/index';

export default class UserService {
	static instance: UserService | null = null;

	constructor() {
		if (UserService.instance) return UserService.instance;
		UserService.instance = this;
	}

	private getUserRepository(entityManager: EntityManager): UserRepository {
		const userRepository: UserRepository | null =
			entityManager.getCustomRepository(UserRepository);

		if (!entityManager || !userRepository)
			throw new CommonError(CommonErrorMessage.UNKNOWN_ERROR);
		return userRepository;
	}

	public async signUp(
		entityManager: EntityManager,
		userData: {
			username: string;
			email: string;
			social_github: string;
		},
	): Promise<boolean> {
		if (
			typeof userData.username !== 'string' ||
			typeof userData.email !== 'string' ||
			typeof userData.social_github !== 'string'
		)
			throw new CommonError(CommonErrorMessage.INVALID_REQUEST);

		const userRepository: UserRepository =
			this.getUserRepository(entityManager);

		const userEntity: User = userRepository.create({
			...userData,
			balance: 0,
		});
		return userRepository.createUser(userEntity);
	}

	public async getUserById(
		entityManager: EntityManager,
		id: number,
	): Promise<User> {
		if (!Number.isInteger(id))
			throw new CommonError(CommonErrorMessage.INVALID_REQUEST);

		const userRepository: UserRepository =
			this.getUserRepository(entityManager);

		const userEntity = await userRepository.readUserById(id);
		if (!userEntity) throw new UserError(UserErrorMessage.NOT_EXIST_USER);
		return userEntity;
	}

	public async setBalance(
		entityManager: EntityManager,
		id: number,
		balance: number,
	): Promise<boolean> {
		if (!Number.isInteger(id) || !Number.isInteger(balance))
			throw new CommonError(CommonErrorMessage.INVALID_REQUEST);

		const userRepository: UserRepository =
			this.getUserRepository(entityManager);

		const userEntity: User = userRepository.create({
			user_id: id,
			balance,
		});

		const result: boolean = await userRepository.updateUser(userEntity);
		if (!result) throw new UserError(UserErrorMessage.NOT_EXIST_USER);
		return result;
	}

	public async deleteUser(
		entityManager: EntityManager,
		id: number,
	): Promise<boolean> {
		if (!Number.isInteger(id))
			throw new CommonError(CommonErrorMessage.INVALID_REQUEST);

		const userRepository: UserRepository =
			this.getUserRepository(entityManager);

		const result: boolean = await userRepository.deleteUser(id);
		if (!result) throw new UserError(UserErrorMessage.NOT_EXIST_USER);
		return result;
	}
}
