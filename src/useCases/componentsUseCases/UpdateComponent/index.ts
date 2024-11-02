import { MongoComponentsRepository } from "../../../repositories/implementations/MongoComponentsRepository";
import { MongoProductsRepository } from "../../../repositories/implementations/MongoProductsRepository";
import { UpdateComponentUseCase } from "./UpdateComponentUseCase";
import { UpdateComponentController } from "./UpdateComponentController";
import { ProductCostUpdateService } from "../../../services/ProductCostUpdateService";

const mongoComponentsRepository = new MongoComponentsRepository();
const mongoProductsRepository = new MongoProductsRepository();
const productCostUpdateService = new ProductCostUpdateService(
  mongoProductsRepository
);

const updateComponentUseCase = new UpdateComponentUseCase(
  mongoComponentsRepository,
  productCostUpdateService
);

const updateComponentController = new UpdateComponentController(
  updateComponentUseCase
);

export { updateComponentController };
