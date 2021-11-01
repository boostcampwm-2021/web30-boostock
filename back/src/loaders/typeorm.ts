import { createConnection, Connection } from 'typeorm';

export default async () => {
	await createConnection();
};
