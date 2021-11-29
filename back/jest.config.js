/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFilesAfterEnv: ['jest-extended'],
	moduleNameMapper: {
		'@api/(.*)': '<rootDir>/src/api/$1',
		'@config/(.*)': '<rootDir>/src/config/$1',
		'@helper/(.*)': '<rootDir>/src/helper/$1',
		'@interfaces/(.*)': '<rootDir>/src/interfaces/$1',
		'@models/(.*)': '<rootDir>/src/models/$1',
		'@repositories/(.*)': '<rootDir>/src/repositories/$1',
		'@services/(.*)': '<rootDir>/src/services/$1',
		'@types/(.*)': '<rootDir>/src/types/$1',
		'@loaders/(.*)': '<rootDir>/src/loaders/$1',
		'@errors/(.*)': '<rootDir>/src/errors/$1',
	},
	globals: {
		'ts-jest': {
			diagnostics: false,
			tsconfig: './tsconfig.json',
		},
	},
};
