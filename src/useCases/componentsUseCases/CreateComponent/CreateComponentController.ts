import { Request, Response } from "express";
import { CreateComponentUseCase } from "./CreateComponentUseCase";
import { IComponentDTO } from "../../../dtos/ComponentDTO";
import { HttpException } from "../../../types/HttpException";

export class CreateComponentController {
  constructor(private createComponentUseCase: CreateComponentUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const data: IComponentDTO = request.body;

    try {
      await this.createComponentUseCase.execute(data);
      return response.status(201).send("Component created");
    } catch (error: any) {
      if (error instanceof HttpException) {
        return response.status(error.status).send({ message: error.message });
      } else if (error.errors) {
        return response.status(400).send({ message: error.errors[0].message });
      }
      return response.status(500).send({ message: "Unexpected error" });
    }
  }
}
