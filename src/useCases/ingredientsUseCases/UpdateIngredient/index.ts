import { MongoIngredientsRepository } from "../../../repositories/implementations/MongoIngredientsRepository";
import { UpdateIngredientUseCase } from "./UpdateIngredientUseCase";
import { UpdateIngredientController } from "./UpdateIngredientController";

const mongoIngredientsRepository = new MongoIngredientsRepository();

const updateIngredientUseCase = new UpdateIngredientUseCase(
  mongoIngredientsRepository
);

const updateIngredientController = new UpdateIngredientController(
  updateIngredientUseCase
);

export { updateIngredientController };
