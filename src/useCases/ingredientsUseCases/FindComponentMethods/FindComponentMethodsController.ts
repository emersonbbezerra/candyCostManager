import { Request, Response } from "express";
import { FindIngredientMethodsUseCase } from "./FindComponentMethodsUseCase";
import { HttpException } from "../../../types/HttpException";

export class FindIngredientMethodsController {
  constructor(
    private findIngredientMethodsUseCase: FindIngredientMethodsUseCase
  ) {}

  async findAll(request: Request, response: Response): Promise<Response> {
    try {
      const ingredients = await this.findIngredientMethodsUseCase.findAll();
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
      const ingredient = await this.findIngredientMethodsUseCase.findById(id);
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

  async findByPartialName(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { name } = request.query;
    try {
      const ingredients =
        await this.findIngredientMethodsUseCase.findByPartialName(
          name as string
        );
      return response.status(200).json(ingredients);
    } catch (error: any) {
      if (error instanceof HttpException) {
        return response.status(error.status).send({ message: error.message });
      } else if (error.errors) {
        return response.status(400).send({ message: error.errors[0].message });
      }
      return response
        .status(500)
        .send({ message: "Unexpected error", error: error.message });
    }
  }
}
