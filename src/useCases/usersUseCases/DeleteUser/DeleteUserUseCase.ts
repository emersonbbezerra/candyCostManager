import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { HttpException } from "../../../utils/HttpException";
import bcrypt from "bcryptjs";

interface DeleteUserRequest {
  password: string;
}

export class DeleteUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(id: string, data: DeleteUserRequest): Promise<void> {
    if (!data.password) {
      throw new HttpException(400, "Password is required to delete account");
    }

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    // Verifica se a senha fornecida está correta
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(401, "Invalid password");
    }

    await this.usersRepository.delete(id);
  }
}
