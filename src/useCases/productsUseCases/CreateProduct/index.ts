import { MongoProductsRepository } from "../../../repositories/implementations/MongoProductsRepository";
import { CreateProductUseCase } from "./CreateProductUseCase";
import { CreateProductController } from "./CreateProductController";

const productsRepository = new MongoProductsRepository();
const createProductUseCase = new CreateProductUseCase(productsRepository);
const createProductController = new CreateProductController(
  createProductUseCase
);

export { createProductController };
