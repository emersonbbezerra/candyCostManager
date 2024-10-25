import { IProductsRepository } from "../../../repositories/IProductsRepository";
import { HttpException } from "../../../types/HttpException";

export class DeleteProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async execute(id: string): Promise<void> {
    const productExists = await this.productsRepository.findById(id);

    if (!productExists) {
      throw new HttpException(404, "Product not found");
    }

    const result = await this.productsRepository.delete(id);

    if (!result) {
      throw new HttpException(500, "Could not delete the product");
    }
  }
}
