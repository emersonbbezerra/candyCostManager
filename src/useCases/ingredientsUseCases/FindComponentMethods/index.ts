import { MongoIngredientsRepository } from "../../../repositories/implementations/MongoComponentsRepository";
import { FindIngredientMethodsUseCase } from "./FindComponentMethodsUseCase";
import { FindIngredientMethodsController } from "./FindComponentMethodsController";

const mongoIngredientsRepository = new MongoIngredientsRepository();

const findIngredientMethodsUseCase = new FindIngredientMethodsUseCase(
  mongoIngredientsRepository
);

const findIngredientMethodsController = new FindIngredientMethodsController(
  findIngredientMethodsUseCase
);

export { findIngredientMethodsController };
