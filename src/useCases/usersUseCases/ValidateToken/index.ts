import { MongoUsersRepository } from '../../../repositories/implementations/MongoUsersRepository';
import { ValidateTokenController } from './ValidateTokenController';
import { ValidateTokenUseCase } from './ValidateTokenUseCase';

const mongoUsersRepository = new MongoUsersRepository();
const validateTokenUseCase = new ValidateTokenUseCase(mongoUsersRepository);
const validateTokenController = new ValidateTokenController(
  validateTokenUseCase
);

export { validateTokenController };
