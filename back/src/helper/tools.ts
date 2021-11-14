import { getConnection, QueryRunner } from 'typeorm';
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

export const toJsonFromError = (error: CommonError): { status: number; json: { error: string; message: string } } => {
	return {
		status: error.status || 500,
		json: {
			error: error.name,
			message: error.message,
		},
	};
};

export const transaction = async (
	callback: (queryRunner: QueryRunner, commit: () => void, rollaback: (err: CommonError) => void, release: () => void) => void,
	req?: Request,
	res?: Response,
): Promise<void> => {
	const connection = getConnection();
	const queryRunner = connection.createQueryRunner();

	const commit = () => {
		queryRunner.commitTransaction();
	};
	const rollback = (err: CommonError) => {
		const errJson = toJsonFromError(err);
		res?.status(errJson.status).json(errJson.json).end();
		queryRunner.rollbackTransaction();
	};
	const release = () => {
		queryRunner.release();
	};

	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {
		callback(queryRunner, commit, rollback, release);
	} catch (err: unknown) {
		queryRunner.rollbackTransaction();
		queryRunner.release();
		res?.status(500).end();
	}
};

export { QueryRunner, EntityManager } from 'typeorm';
