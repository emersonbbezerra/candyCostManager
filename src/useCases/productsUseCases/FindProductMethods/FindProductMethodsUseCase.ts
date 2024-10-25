import { IProductsRepository } from "../../../repositories/IProductsRepository";
import { Product } from "../../../entities/Product";

export class FindProductMethodsUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.productsRepository.findById(id);
    return product;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productsRepository.findAll();
    return products;
  }
}
