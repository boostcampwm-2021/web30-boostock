import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'session' })
export default class Session {
	@PrimaryGeneratedColumn({ name: 'session_id' })
	sessionId: string;

	@Column()
	expires: number;

	@Column()
	data: string;
}
