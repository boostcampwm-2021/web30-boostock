import dotenv from 'dotenv';
import path from 'path';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const env = dotenv.config({
	path: path.resolve(process.cwd(), process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'),
});

if (env.error) {
	throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
export default {
	clientURL: process.env.CLIENT_URL,
	port: parseInt(process.env.PORT || '3333', 10),
	logs: {
		level: process.env.LOG_LEVEL || 'silly',
	},
};
