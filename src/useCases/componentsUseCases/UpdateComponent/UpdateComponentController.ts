import { Request, Response } from "express";
import { UpdateComponentUseCase } from "./UpdateComponentUseCase";
import { Component } from "../../../entities/Component";
import { HttpException } from "../../../types/HttpException";

export class UpdateComponentController {
  constructor(private updateComponentUseCase: UpdateComponentUseCase) {}

  async handle(request: Request, response: Response): Promise<Response | null> {
    const { id } = request.params;
    const data: Partial<Component> = request.body;

    try {
      const component = await this.updateComponentUseCase.execute(id, data);
      return response
        .status(200)
        .json({ message: "Component updated", component });
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
