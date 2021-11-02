import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User {
	@PrimaryGeneratedColumn()
	user_id: number;

	@Column()
	username: string;

	@Column()
	email: string;

	@Column()
	social_github: string;

	@Column()
	balance: number;
}
