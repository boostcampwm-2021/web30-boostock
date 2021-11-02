import { createConnections } from 'typeorm';

export default async () => {
	await createConnections();
};
