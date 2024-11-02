import { MongoIngredientsRepository } from "../../../repositories/implementations/MongoComponentsRepository";
import { CreateIngredientController } from "./CreateComponentController";
import { CreateIngredientUseCase } from "./CreateComponentUseCase";

const mongoIngredientsRepository = new MongoIngredientsRepository();

const createIngredientUseCase = new CreateIngredientUseCase(
  mongoIngredientsRepository
);

const createIngredientController = new CreateIngredientController(
  createIngredientUseCase
);

export { createIngredientController };
