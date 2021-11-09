import expressLoader from './express';
import typeormLoader from './typeorm';
import mongooseLoader from './mongoose';

import Logger from './logger';

export default async ({ expressApp, http }): Promise<void> => {
	await expressLoader({ app: expressApp });
	Logger.info('✌️ Express loaded');
	await typeormLoader();
	Logger.info('✌️ Typeorm loaded');
	await mongooseLoader();
	Logger.info('✌️ Mongoose loaded');
};
