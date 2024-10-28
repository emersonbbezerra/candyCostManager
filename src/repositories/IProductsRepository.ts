import { Product } from "../entities/Product";

export interface IProductsRepository {
  findByName(name: string): Promise<Product | null>;
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(product: Product): Promise<void>;
  delete(id: string): Promise<boolean>;
}
