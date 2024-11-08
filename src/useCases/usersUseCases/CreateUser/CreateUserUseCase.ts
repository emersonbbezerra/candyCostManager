import bcrypt from 'bcryptjs';
import { IUserDTO } from '../../../dtos/UserDTO';
import { User } from '../../../entities/User';
import { IUsersRepository } from '../../../repositories/IUsersRepository';
import { HttpException } from '../../../utils/HttpException';
import { userSchema } from '../../../utils/userUtils';

export class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(data: IUserDTO): Promise<User | void> {
    const validatedData = userSchema.parse(data);

    const userExists = await this.usersRepository.findByEmail(
      validatedData.email
    );

    if (userExists) {
      throw new HttpException(409, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = new User({
      ...validatedData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.usersRepository.save(user);
  }
}
