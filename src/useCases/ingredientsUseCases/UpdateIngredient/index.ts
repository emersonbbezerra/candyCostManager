import { MongoIngredientsRepository } from "../../../repositories/implementations/MongoIngredientsRepository";
import { MongoProductsRepository } from "../../../repositories/implementations/MongoProductsRepository";
import { UpdateIngredientUseCase } from "./UpdateIngredientUseCase";
import { UpdateIngredientController } from "./UpdateIngredientController";
import { ProductCostUpdateService } from "../../../services/ProductCostUpdateService";

const mongoIngredientsRepository = new MongoIngredientsRepository();
const mongoProductsRepository = new MongoProductsRepository();
const productCostUpdateService = new ProductCostUpdateService(
  mongoProductsRepository
);

const updateIngredientUseCase = new UpdateIngredientUseCase(
  mongoIngredientsRepository,
  productCostUpdateService
);

const updateIngredientController = new UpdateIngredientController(
  updateIngredientUseCase
);

export { updateIngredientController };
