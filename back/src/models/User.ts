/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserFavorite, UserStock } from './index';

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

	@OneToMany(() => UserFavorite, (userFavorite: UserFavorite) => userFavorite.userId, { cascade: true })
	favorites: UserFavorite[];

	@OneToMany(() => UserStock, (userStock: UserStock) => userStock.userId, { cascade: true })
	stocks: UserStock[];
}
