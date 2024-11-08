import { MongoUsersRepository } from '../../../repositories/implementations/MongoUsersRepository';
import { DeleteUserUseCase } from './DeleteUserUseCase';
import { DeleteUserController } from './DeleteUserController';

const usersRepository = new MongoUsersRepository();
const deleteUserUseCase = new DeleteUserUseCase(usersRepository);
const deleteUserController = new DeleteUserController(deleteUserUseCase);

export { deleteUserController };
