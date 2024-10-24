import { MongoIngredientsRepository } from "../../../repositories/implementations/MongoIngredientsRepository";
import { FindMethodsUseCase } from "./FindMethodsUseCase";
import { FindMethodsController } from "./FindMethodsController";

const mongoIngredientsRepository = new MongoIngredientsRepository();

const findMethodsUseCase = new FindMethodsUseCase(mongoIngredientsRepository);

const findMethodsController = new FindMethodsController(findMethodsUseCase);

export { findMethodsController };
