import config from '@config/index';
import expressLoader from './express';
import typeormLoader from './typeorm';
import mongooseLoader from './mongoose';
import candleMaker from './candleMaker';
import Logger from './logger';

export default async ({ expressApp }): Promise<void> => {
	await expressLoader({ app: expressApp });
	Logger.info('✌️ Express loaded');
	await typeormLoader();
	Logger.info('✌️ Typeorm loaded');
	await mongooseLoader();
	Logger.info('✌️ Mongoose loaded');
	if (config.instanceId === 0) {
		candleMaker();
		Logger.info('✌️ CandleMaker loaded');
	}
};
