import { Request, Response } from "express";
import { CreateIngredientUseCase } from "./CreateIngredientUseCase";
import { ICreateIngredientRequestDTO } from "./CreateIngredientDTO";
import { HttpException } from "../../../types/HttpException";

export class CreateIngredientController {
  constructor(private createIngredientUseCase: CreateIngredientUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const data: ICreateIngredientRequestDTO = request.body;

    try {
      await this.createIngredientUseCase.execute(data);
      return response.status(201).send("Ingredient created");
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
