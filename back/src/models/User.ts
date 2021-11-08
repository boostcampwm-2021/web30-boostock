/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import UserFavorite from './UserFavorite';
import UserStock from './UserStock';

@Entity({ name: 'user' })
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

	@OneToMany(
		() => UserFavorite,
		(userFavorite: UserFavorite) => userFavorite.user_id,
	)
	favorites: UserFavorite[];

	@OneToMany(() => UserStock, (userStock: UserStock) => userStock.user_id)
	stocks: UserStock[];
}
