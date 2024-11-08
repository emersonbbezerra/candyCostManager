import { Product } from '../../../entities/Product';
import {
  FindAllProductsOptions,
  FindAllProductsResult,
  IProductsRepository,
} from '../../../repositories/IProductsRepository';
import { HttpException } from '../../../utils/HttpException';

export class FindProductMethodsUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async findAll(
    params: FindAllProductsOptions = {}
  ): Promise<FindAllProductsResult> {
    return this.productsRepository.findAll({
      page: params.page,
      limit: params.limit,
      category: params.category,
    });
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.productsRepository.findById(id);
    if (!result) {
      throw new HttpException(404, 'Product not found');
    }
    return result;
  }

  async findByPartialName(name: string): Promise<Product[]> {
    return await this.productsRepository.findByPartialName(name);
  }
}
