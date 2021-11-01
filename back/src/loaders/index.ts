import expressLoader from './express';
import typeormLoader from './typeorm';
import Logger from './logger';

export default async ({ expressApp, http }) => {
	await expressLoader({ app: expressApp });
	Logger.info('✌️ Express loaded');
	await typeormLoader();
	Logger.info('✌️ Typeorm loaded');

	// ... more loaders can be here
};
