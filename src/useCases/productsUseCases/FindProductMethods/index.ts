import { MongoProductsRepository } from "../../../repositories/implementations/MongoProductsRepository";
import { FindProductMethodsUseCase } from "./FindProductMethodsUseCase";
import { FindProductMethodsController } from "./FindProductMethodsController";

const productsRepository = new MongoProductsRepository();
const findProductMethodsUseCase = new FindProductMethodsUseCase(
  productsRepository
);
const findProductMethodsController = new FindProductMethodsController(
  findProductMethodsUseCase
);

export { findProductMethodsController };
