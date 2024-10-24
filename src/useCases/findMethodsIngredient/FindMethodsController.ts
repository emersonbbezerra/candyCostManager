import { Request, Response } from "express";
import { FindMethodsUseCase } from "./FindMethodsUseCase";
import { HttpException } from "../../types/HttpException";

export class FindMethodsController {
  constructor(private findMethodsUseCase: FindMethodsUseCase) {}

  async findAll(request: Request, response: Response): Promise<Response> {
    try {
      const ingredients = await this.findMethodsUseCase.findAll();
      return response.status(200).json(ingredients);
    } catch (error: any) {
      if (error instanceof HttpException) {
        return response.status(error.status).send({ message: error.message });
      } else if (error.errors) {
        return response.status(400).send({ message: error.errors[0].message });
      }
      return response.status(500).send({ message: "Unexpected error" });
    }
  }

  async findById(
    request: Request,
    response: Response
  ): Promise<Response | null> {
    const { id } = request.params;
    try {
      const ingredient = await this.findMethodsUseCase.findById(id);
      return response.status(200).json(ingredient);
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
