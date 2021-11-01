import { EntityRepository, Repository } from 'typeorm';
import User from '../User';

@EntityRepository()
export default class UserRepository extends Repository<User> {}
