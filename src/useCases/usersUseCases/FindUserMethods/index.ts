import { MongoUsersRepository } from '../../../repositories/implementations/MongoUsersRepository';
import { FindUserMethodsUseCase } from './FindUserMethodsUseCase';
import { FindUserMethodsController } from './FindUserMethodsController';

const usersRepository = new MongoUsersRepository();
const findUserMethodsUseCase = new FindUserMethodsUseCase(usersRepository);
const findUserMethodsController = new FindUserMethodsController(
  findUserMethodsUseCase
);

export { findUserMethodsController };
