import { createConnections, getConnection } from 'typeorm';

export async function open() {
	await createConnections();
}

export async function close() {
	getConnection().close();
}
