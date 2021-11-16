/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import UserFavorite from './UserFavorite';
import UserStock from './UserStock';

@Entity({ name: 'user' })
export default class User {
	@PrimaryGeneratedColumn({ name: 'user_id', type: 'number' })
	userId: number;

	@Column()
	username: string;

	@Column()
	email: string;

	@Column({ name: 'social_github' })
	socialGithub: string;

	@Column()
	balance: number;

	@OneToMany(() => UserFavorite, (userFavorite: UserFavorite) => userFavorite.userId)
	favorites: UserFavorite[];

	@OneToMany(() => UserStock, (userStock: UserStock) => userStock.userId)
	stocks: UserStock[];
}
