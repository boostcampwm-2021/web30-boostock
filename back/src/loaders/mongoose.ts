import mongoose from 'mongoose';

export default async (): Promise<void> => {
	await mongoose.connect(`mongodb://${process.env.MONGODB_HOST}:27017/boostock`, {
		user: process.env.MONGODB_USER,
		pass: process.env.MONGODB_PASSWORD,
		authSource: 'admin',
	});
};
