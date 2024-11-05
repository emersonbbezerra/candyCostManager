import { NextFunction, Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { email, password } = req.body;

    try {
      await this.createUserUseCase.execute({
        email,
        password,
      });

      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      next(error);
    }
  }
}
