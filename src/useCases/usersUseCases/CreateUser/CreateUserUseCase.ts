import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { User } from "../../../entities/User";
import { IUserDTO } from "../../../dtos/UserDTO";
import bcrypt from "bcryptjs";
import { HttpException } from "../../../utils/HttpException";
import { userSchema } from "../../../utils/userUtils";

export class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(data: IUserDTO): Promise<void> {
    const validatedData = userSchema.parse(data);

    const userExists = await this.usersRepository.findByEmail(
      validatedData.email
    );

    if (userExists) {
      throw new HttpException(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = new User({
      email: validatedData.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.usersRepository.save(user);
  }
}
