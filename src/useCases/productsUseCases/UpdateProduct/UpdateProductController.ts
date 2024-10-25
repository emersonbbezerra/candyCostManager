import { Request, Response } from "express";
import { UpdateProductUseCase } from "./UpdateProductUseCase";
import { IProductDTO } from "../../../dtos/ProductDTO";
import { HttpException } from "../../../types/HttpException";

export class UpdateProductController {
  constructor(private updateProductUseCase: UpdateProductUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const data: Partial<IProductDTO> = request.body;

    try {
      const product = await this.updateProductUseCase.execute(id, data);
      return response.status(200).send({ message: "Product updated", product });
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
