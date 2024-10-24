import { MongoIngredientsRepository } from "../../repositories/implementations/MongoIngredientsRepository";
import { DeleteIngredientUseCase } from "./DeleteIngredientUseCase";
import { DeleteIngredientController } from "./DeleteIngredientController";

const mongoIngredientsRepository = new MongoIngredientsRepository();

const deleteIngredientUseCase = new DeleteIngredientUseCase(
  mongoIngredientsRepository
);

const deleteIngredientController = new DeleteIngredientController(
  deleteIngredientUseCase
);

export { deleteIngredientController };
