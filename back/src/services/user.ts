import { User } from '@models/index';
import { IUser } from '@interfaces/IUser';
import { getRepository, Repository } from 'typeorm';

let instance;
export default class UserService {
	protected userRepository: Repository<IUser> = getRepository(User);

	constructor() {
		if (instance) return instance;
		instance = this;
	}

	public async SignUp(_user: User) {
		const user = await this.userRepository.create(_user);
		const results = await this.userRepository.save(user);
	}

	public async FindOne(id: string) {
		const results = await this.userRepository.findOne(id);
		return results;
	}

	public async Find() {
		const users = await this.userRepository.find();
		return users;
	}

	public async UpdateFirstName(_id, _firstname): Promise<User | null> {
		const user = await this.userRepository.findOne(_id);
		if (user === undefined) {
			return null;
		}
		this.userRepository.merge(user, _firstname);
		const results = await this.userRepository.save(user);
		return results;
	}

	public async Delete(_id: number) {
		const results = await this.userRepository.delete(_id);
		return results;
	}
}
