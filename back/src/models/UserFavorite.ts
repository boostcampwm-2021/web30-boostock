/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import User from './User';

@Entity({ name: 'user_favorite' })
export default class UserFavorite {
	@PrimaryGeneratedColumn({ name: 'user_favorite_id' })
	userFavoriteId: number;

	@ManyToOne(() => User, (user: User) => user.userId)
	@JoinColumn({ name: 'user_id' })
	userId: number;

	@Column()
	stockId: number;
}
