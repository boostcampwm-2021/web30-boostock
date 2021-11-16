/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import UserFavorite from './UserFavorite';
import UserStock from './UserStock';

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

	@OneToMany(() => UserFavorite, (userFavorite: UserFavorite) => userFavorite.userId)
	favorites: UserFavorite[];

	@OneToMany(() => UserStock, (userStock: UserStock) => userStock.userId)
	stocks: UserStock[];
}
