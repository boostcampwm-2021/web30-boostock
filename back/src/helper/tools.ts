import { CommonError } from '@errors/index';
import { ISocketRequest } from '@interfaces/socketRequest';
import Crypto from 'crypto';

export const snakeToCamel = (str: string): string => {
	return str.toLowerCase().replace(/([-_][a-z])/g, (group) => {
		return group.toUpperCase().replace('-', '').replace('_', '');
	});
};

export const camelToSnake = (str: string): string => {
	return str.replace(/[A-Z]/g, (letter) => {
		return `_${letter.toLowerCase()}`;
	});
};

export const binArrayToJson = (binArray: ArrayBufferLike): ISocketRequest => JSON.parse(new TextDecoder().decode(binArray));
export const JsonToBinArray = (json: unknown): Uint8Array => new TextEncoder().encode(JSON.stringify(json, null, 0));

export const toJsonFromError = (error: CommonError): { status: number; json: { error: string; message: string } } => {
	return {
		status: error.status || 500,
		json: {
			error: error.name,
			message: error.message,
		},
	};
};

export const generateUUID = (): string => {
	return Crypto.randomUUID();
};
