import { Request, Response } from "express";
import { FindProductMethodsUseCase } from "./FindProductMethodsUseCase";

export class FindProductMethodsController {
  constructor(private findProductMethodsUseCase: FindProductMethodsUseCase) {}

  async findById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const product = await this.findProductMethodsUseCase.findById(id);
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
      return res.status(200).send(product);
    } catch (error: any) {
      return res
        .status(500)
        .send({ message: "Unexpected error", error: error.message });
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const products = await this.findProductMethodsUseCase.findAll();
      return res.status(200).send(products);
    } catch (error: any) {
      return res
        .status(500)
        .send({ message: "Unexpected error", error: error.message });
    }
  }
}
