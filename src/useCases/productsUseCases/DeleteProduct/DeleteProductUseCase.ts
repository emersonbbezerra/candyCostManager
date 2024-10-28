import { IProductsRepository } from "../../../repositories/IProductsRepository";
import { HttpException } from "../../../types/HttpException";

export class DeleteProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.productsRepository.delete(id);
    if (!deleted) {
      throw new HttpException(404, "Product not found");
    }
  }
}
