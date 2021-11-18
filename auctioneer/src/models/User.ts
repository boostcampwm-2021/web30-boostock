/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export default class User {
	@PrimaryGeneratedColumn({ name: 'user_id' })
	userId: number;

	@Column({ type: 'varchar', length: 50 })
	username: string;

	@Column({ type: 'varchar', length: 100, unique: true })
	email: string;

	@Column({ name: 'social_github', unique: true })
	socialGithub: string;

	@Column({ type: 'int' })
	balance: number;
}
