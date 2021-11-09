/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import User from './User';

@Entity({ name: 'user_favorite' })
export default class UserFavorite {
	@PrimaryGeneratedColumn()
	user_favorite_id: number;

	@ManyToOne(() => User, (user: User) => user.user_id)
	@JoinColumn({ name: 'user_id' })
	user_id: number;

	@Column()
	stock_id: number;
}
