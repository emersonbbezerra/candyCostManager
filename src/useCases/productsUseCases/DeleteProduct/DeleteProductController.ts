import { Request, Response } from "express";
import { DeleteProductUseCase } from "./DeleteProductUseCase";
import { HttpException } from "../../../types/HttpException";

export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      await this.deleteProductUseCase.execute(id);
      return res.status(200).send({ message: "Product deleted successfully" });
    } catch (error: any) {
      if (error instanceof HttpException) {
        return res.status(error.status).send({ message: error.message });
      }
      return res
        .status(500)
        .send({ message: "Unexpected error", error: error.message });
    }
  }
}
