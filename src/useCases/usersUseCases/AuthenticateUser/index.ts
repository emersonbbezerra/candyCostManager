import { MongoUsersRepository } from '../../../repositories/implementations/MongoUsersRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { AuthenticateUserController } from './AuthenticateUserController';

const usersRepository = new MongoUsersRepository();
const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
const authenticateUserController = new AuthenticateUserController(
  authenticateUserUseCase
);

export { authenticateUserController };
