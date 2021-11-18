import { EntityRepository, Like, Repository } from 'typeorm';
import Session from '@models/Session';

@EntityRepository(Session)
export default class SessionRepository extends Repository<Session> {
	async findById(userId: number): Promise<Session[]> {
		return this.find({ where: { data: Like(`%"userId":${userId}%`) } });
	}
}
