/* eslint-disable import/no-cycle */
import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'stock' })
export default class Stock {
	@PrimaryGeneratedColumn({ name: 'stock_id' })
	stockId: number;

	@Column({ unique: true })
	code: string;

	@Column({ name: 'name_korean' })
	nameKorean: string;

	@Column({ name: 'name_english' })
	nameEnglish: string;

	@Column()
	price: number;

	@Column({ name: 'previous_close' })
	previousClose: number;
}
