import { CommonError } from '@errors/index';

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

export function sleep(ms) {
	const wakeUpTime = Date.now() + ms;
	while (Date.now() < wakeUpTime);
}

export function needToHandle() {}
