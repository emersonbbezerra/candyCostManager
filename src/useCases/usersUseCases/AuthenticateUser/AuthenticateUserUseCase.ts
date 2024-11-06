import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { HttpException } from "../../../utils/HttpException";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IAuthenticateUserResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export class AuthenticateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(
    email: string,
    password: string
  ): Promise<IAuthenticateUserResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new HttpException(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpException(401, "Invalid credentials");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
