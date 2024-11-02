import { Request, Response } from "express";
import { FindProductMethodsUseCase } from "./FindProductMethodsUseCase";
import { HttpException } from "../../../types/HttpException";

export class FindProductMethodsController {
  constructor(private findProductMethodsUseCase: FindProductMethodsUseCase) {}

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const products = await this.findProductMethodsUseCase.findAll();
      return res.status(200).send(products);
    } catch (error: any) {
      if (error instanceof HttpException) {
        return res.status(error.status).send({ message: error.message });
      } else if (error.errors) {
        return res.status(400).send({ message: error.errors[0].message });
      }
      return res
        .status(500)
        .send({ message: "Unexpected error", error: error.message });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const product = await this.findProductMethodsUseCase.findById(id);
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
      return res.status(200).send(product);
    } catch (error: any) {
      if (error instanceof HttpException) {
        return res.status(error.status).send({ message: error.message });
      } else if (error.errors) {
        return res.status(400).send({ message: error.errors[0].message });
      }
      return res
        .status(500)
        .send({ message: "Unexpected error", error: error.message });
    }
  }

  async findByPartialName(req: Request, res: Response): Promise<Response> {
    const { name } = req.query;
    try {
      const products = await this.findProductMethodsUseCase.findByPartialName(
        name as string
      );
      return res.status(200).json(products);
    } catch (error: any) {
      if (error instanceof HttpException) {
        return res.status(error.status).send({ message: error.message });
      } else if (error.errors) {
        return res.status(400).send({ message: error.errors[0].message });
      }
      return res
        .status(500)
        .send({ message: "Unexpected error", error: error.message });
    }
  }
}
