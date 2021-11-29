import { jest, beforeAll, describe, expect, test } from '@jest/globals';
import { open, close } from './helper';
import { getConnection } from 'typeorm';

import { Stock } from '../src/models/index';
import { StockService } from '../src/services/index';
import { StockError, StockErrorMessage } from '../src/errors/index';

beforeAll(async () => {
	await open();
});

describe('getStockById()', () => {
	test('Normal', async () => {
		const stockServiceInstance = new StockService();
		const queryRunner = getConnection().createQueryRunner();
		expect(stockServiceInstance.getStockById(queryRunner.manager, 1)).resolves.toBeInstanceOf(Stock);
	});

	test('Not Exist Stock', async () => {
		const stockServiceInstance = new StockService();
		const queryRunner = getConnection().createQueryRunner();
		expect(stockServiceInstance.getStockById(queryRunner.manager, -1)).rejects.toThrow(
			new StockError(StockErrorMessage.NOT_EXIST_STOCK),
		);
	});
});

describe('getStockByCode()', () => {
	test('Normal', async () => {
		const stockServiceInstance = new StockService();
		const queryRunner = getConnection().createQueryRunner();
		expect(stockServiceInstance.getStockByCode(queryRunner.manager, 'HNX')).resolves.toBeInstanceOf(Stock);
	});

	test('Not Exist Stock', async () => {
		const stockServiceInstance = new StockService();
		const queryRunner = getConnection().createQueryRunner();
		expect(stockServiceInstance.getStockByCode(queryRunner.manager, 'ZZZ')).rejects.toThrow(
			new StockError(StockErrorMessage.NOT_EXIST_STOCK),
		);
	});
});
