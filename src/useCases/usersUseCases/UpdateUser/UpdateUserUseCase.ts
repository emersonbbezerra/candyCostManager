import bcrypt from "bcryptjs";
import { User } from "../../../entities/User";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { HttpException } from "../../../utils/HttpException";
import { userSchema } from "../../../utils/userUtils";

interface UpdateUserRequest {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export class UpdateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(id: string, data: UpdateUserRequest): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const updateData: Partial<User> = {};

    // Verificação para atualização de senha
    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new HttpException(
          400,
          "Current password is required to update password"
        );
      }

      // Valida a nova senha usando o schema do Zod existente
      userSchema.shape.password.parse(data.newPassword);

      const isPasswordValid = await bcrypt.compare(
        data.currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        throw new HttpException(401, "Current password is incorrect");
      }

      // Hash da nova senha
      updateData.password = await bcrypt.hash(data.newPassword, 10);
    }

    // Verificação para atualização de email
    if (data.email && data.email !== user.email) {
      if (!data.currentPassword) {
        throw new HttpException(400, "Password is required to update email");
      }

      // Valida o novo email usando o schema do Zod existente
      userSchema.shape.email.parse(data.email);

      const isPasswordValid = await bcrypt.compare(
        data.currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        throw new HttpException(401, "Password is incorrect");
      }

      // Verifica se o novo email já está em uso
      const existingUser = await this.usersRepository.findByEmail(data.email);
      if (existingUser) {
        throw new HttpException(409, "Email already in use");
      }

      updateData.email = data.email;
    }

    const updatedUser = await this.usersRepository.update(id, {
      ...updateData,
      updatedAt: new Date(),
    });

    if (!updatedUser) {
      throw new HttpException(404, "Failed to update user");
    }

    return updatedUser;
  }
}
