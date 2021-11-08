import { getConnection } from 'typeorm';
import { Request, Response } from 'express';
import { CommonError } from '@services/errors/index';

export const snakeToCamel = (str) => {
	return str.toLowerCase().replace(/([-_][a-z])/g, (group) => {
		return group.toUpperCase().replace('-', '').replace('_', '');
	});
};

export const camelToSnake = (str) => {
	return str.replace(/[A-Z]/g, (letter) => {
		return `_${letter.toLowerCase()}`;
	});
};

export const toJsonFromError = (
	error: CommonError,
): { status: number; json: { error: string; message: string } } => {
	return {
		status: error.status || 500,
		json: {
			error: error.name,
			message: error.message,
		},
	};
};

export const transaction = async (
	req: Request,
	res: Response,
	callback: any,
): Promise<void> => {
	const connection = getConnection();
	const queryRunner = connection.createQueryRunner();
	const thenTransaction = () => {
		queryRunner.commitTransaction();
	};
	const catchTransaction = (err: CommonError) => {
		const errJson = toJsonFromError(err);
		res.status(errJson.status).json(errJson.json).end();
		queryRunner.rollbackTransaction();
	};
	const finallyTransaction = () => {
		queryRunner.release();
	};

	await queryRunner.connect();
	await queryRunner.startTransaction();

	callback(
		queryRunner,
		thenTransaction,
		catchTransaction,
		finallyTransaction,
	);
};

export { QueryRunner, EntityManager } from 'typeorm';
