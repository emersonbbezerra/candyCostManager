import { IProductsRepository } from "../../../repositories/IProductsRepository";
import { Product } from "../../../entities/Product";
import { HttpException } from "../../../utils/HttpException";

export class FindProductMethodsUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.findAll();
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.productsRepository.findById(id);
    if (!result) {
      throw new HttpException(404, "Product not found");
    }
    return result;
  }

  async findByPartialName(name: string): Promise<Product[]> {
    try {
      return await this.productsRepository.findByPartialName(name);
    } catch (error) {
      throw error;
    }
  }
}
