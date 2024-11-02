import { MongoComponentsRepository } from "../../../repositories/implementations/MongoComponentsRepository";
import { CreateComponentController } from "./CreateComponentController";
import { CreateComponentUseCase } from "./CreateComponentUseCase";

const mongoComponentsRepository = new MongoComponentsRepository();

const createComponentUseCase = new CreateComponentUseCase(
  mongoComponentsRepository
);

const createComponentController = new CreateComponentController(
  createComponentUseCase
);

export { createComponentController };
