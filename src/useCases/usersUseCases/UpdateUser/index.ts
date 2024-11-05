import { MongoUsersRepository } from "../../../repositories/implementations/MongoUsersRepository";
import { UpdateUserUseCase } from "./UpdateUserUseCase";
import { UpdateUserController } from "./UpdateUserController";

const usersRepository = new MongoUsersRepository();
const updateUserUseCase = new UpdateUserUseCase(usersRepository);
const updateUserController = new UpdateUserController(updateUserUseCase);

export { updateUserController };
