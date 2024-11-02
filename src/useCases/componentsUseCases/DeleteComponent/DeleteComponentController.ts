import { Request, Response } from "express";
import { DeleteComponentUseCase } from "./DeleteComponentUseCase";
import { HttpException } from "../../../types/HttpException";

export class DeleteComponentController {
  constructor(private deleteComponentUseCase: DeleteComponentUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    try {
      await this.deleteComponentUseCase.execute(id);
      return response.status(200).send({ message: "Component deleted" });
    } catch (error: any) {
      if (error instanceof HttpException) {
        return response.status(error.status).send({ message: error.message });
      }
      if (error.errors) {
        return response.status(400).send({ message: error.errors[0].message });
      }
      console.error(error);
      return response.status(500).send({ message: "Unexpected error" });
    }
  }
}
