import { MongoProductsRepository } from "../../../repositories/implementations/MongoProductsRepository";
import { DeleteProductUseCase } from "./DeleteProductUseCase";
import { DeleteProductController } from "./DeleteProductController";

const productsRepository = new MongoProductsRepository();
const deleteProductUseCase = new DeleteProductUseCase(productsRepository);
const deleteProductController = new DeleteProductController(
  deleteProductUseCase
);

export { deleteProductController };
