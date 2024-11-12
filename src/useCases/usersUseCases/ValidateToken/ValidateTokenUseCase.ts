import jwt from 'jsonwebtoken';
import { IUsersRepository } from '../../../repositories/IUsersRepository';
import { HttpException } from '../../../utils/HttpException';

interface IValidateTokenResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export class ValidateTokenUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(token: string): Promise<IValidateTokenResponse> {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
      email: string;
    };

    const user = await this.usersRepository.findById(decoded.id);

    if (!user) {
      throw new HttpException(401, 'Invalid token');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
