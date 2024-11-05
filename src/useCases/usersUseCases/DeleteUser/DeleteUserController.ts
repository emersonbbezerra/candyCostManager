import { NextFunction, Request, Response } from "express";
import { DeleteUserUseCase } from "./DeleteUserUseCase";

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { id } = req.params;
    const { password } = req.body;

    try {
      await this.deleteUserUseCase.execute(id, { password });
      return res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}