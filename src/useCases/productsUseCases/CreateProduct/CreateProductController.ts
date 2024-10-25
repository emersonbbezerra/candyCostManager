import { Request, Response } from "express";
import { CreateProductUseCase } from "./CreateProductUseCase";
import { IProductDTO } from "../../../dtos/ProductDTO";
import { HttpException } from "../../../types/HttpException";

export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const data: IProductDTO = request.body;

    try {
      await this.createProductUseCase.execute(data);
      return response
        .status(201)
        .send({ message: "Product created successfully" });
    } catch (error: any) {
      if (error instanceof HttpException) {
        return response.status(error.status).send({ message: error.message });
      }
      if (error.errors) {
        const friendlyErrorMessages = error.errors
          .map((e: any) => e.message)
          .join(", ");
        return response.status(400).send({ message: friendlyErrorMessages });
      }
      console.error(error);
      return response
        .status(500)
        .send({ message: "Unexpected error", error: error.message });
    }
  }
}
