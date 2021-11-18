/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_favorite' })
export default class UserFavorite {
	@PrimaryGeneratedColumn({ name: 'user_favorite_id' })
	userFavoriteId: number;

	@Column({ name: 'user_id' })
	userId: number;

	@Column({ name: 'stock_id' })
	stockId: number;
}
