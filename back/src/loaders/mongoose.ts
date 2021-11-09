import mongoose from 'mongoose';

export default async (): Promise<void> => {
	await mongoose.connect(
		`mongodb://${process.env.MONGODB_HOST}:${
			process.env.MONGODB_PORT || '27017'
		}`,
		{
			user: process.env.MONGODB_USER,
			pass: process.env.MONGODB_PASSWORD,
			authSource: 'admin',
		},
	);
};
