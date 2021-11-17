/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export default class User {
	@PrimaryGeneratedColumn({ name: 'user_id' })
	userId: number;

	@Column()
	username: string;

	@Column()
	email: string;

	@Column({ name: 'social_github' })
	socialGithub: string;

	@Column()
	balance: number;
}
