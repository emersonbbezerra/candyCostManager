import { Request, Response } from "express";
import { FindComponentMethodsUseCase } from "./FindComponentMethodsUseCase";
import { HttpException } from "../../../types/HttpException";

export class FindComponentMethodsController {
  constructor(
    private findComponentMethodsUseCase: FindComponentMethodsUseCase
  ) {}

  async findAll(request: Request, response: Response): Promise<Response> {
    try {
      const components = await this.findComponentMethodsUseCase.findAll();
      return response.status(200).json(components);
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
      const component = await this.findComponentMethodsUseCase.findById(id);
      return response.status(200).json(component);
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
      const components =
        await this.findComponentMethodsUseCase.findByPartialName(
          name as string
        );
      return response.status(200).json(components);
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
