import { MongoIngredientsRepository } from "../../repositories/implementations/MongoIngredientsRepository";
import { CreateIngredientController } from "./CreateIngredientController";
import { CreateIngredientUseCase } from "./CreateIngredientUseCase";

const mongoIngredientsRepository = new MongoIngredientsRepository();

const createIngredientUseCase = new CreateIngredientUseCase(
  mongoIngredientsRepository
);

const createIngredientController = new CreateIngredientController(
  createIngredientUseCase
);

export { createIngredientController };
