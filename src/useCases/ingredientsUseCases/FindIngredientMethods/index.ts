import { MongoIngredientsRepository } from "../../../repositories/implementations/MongoIngredientsRepository";
import { FindIngredientMethodsUseCase } from "./FindIngredientMethodsUseCase";
import { FindIngredientMethodsController } from "./FindIngredientMethodsController";

const mongoIngredientsRepository = new MongoIngredientsRepository();

const findIngredientMethodsUseCase = new FindIngredientMethodsUseCase(
  mongoIngredientsRepository
);

const findIngredientMethodsController = new FindIngredientMethodsController(
  findIngredientMethodsUseCase
);

export { findIngredientMethodsController };
