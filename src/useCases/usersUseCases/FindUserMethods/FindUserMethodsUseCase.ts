import { IUsersRepository } from '../../../repositories/IUsersRepository';
import { HttpException } from '../../../utils/HttpException';

export class FindUserMethodsUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new HttpException(404, 'User  not found');
    }
    return user;
  }
}
