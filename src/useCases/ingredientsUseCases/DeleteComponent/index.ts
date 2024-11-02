import { MongoIngredientsRepository } from "../../../repositories/implementations/MongoComponentsRepository";
import { DeleteIngredientUseCase } from "./DeleteComponentUseCase";
import { DeleteIngredientController } from "./DeleteComponentController";

const mongoIngredientsRepository = new MongoIngredientsRepository();

const deleteIngredientUseCase = new DeleteIngredientUseCase(
  mongoIngredientsRepository
);

const deleteIngredientController = new DeleteIngredientController(
  deleteIngredientUseCase
);

export { deleteIngredientController };
