import { createConnections } from 'typeorm';

export default async (): Promise<void> => {
	await createConnections();
};
