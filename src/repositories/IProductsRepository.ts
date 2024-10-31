import { Product } from "../entities/Product";

export interface IProductsRepository {
  findByNameAndCategory(
    name: string,
    category: string
  ): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(id: string, product: Product): Promise<Partial<Product> | null>;
  delete(id: string): Promise<boolean>;
}
