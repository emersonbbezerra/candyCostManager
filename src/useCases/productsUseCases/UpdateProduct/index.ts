import { MongoProductsRepository } from "../../../repositories/implementations/MongoProductsRepository";
import { UpdateProductUseCase } from "./UpdateProductUseCase";
import { UpdateProductController } from "./UpdateProductController";

const productsRepository = new MongoProductsRepository();
const updateProductUseCase = new UpdateProductUseCase(productsRepository);
const updateProductController = new UpdateProductController(
  updateProductUseCase
);

export { updateProductController };
