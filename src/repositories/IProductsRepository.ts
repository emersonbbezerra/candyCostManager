import { Product } from "../entities/Product";

export interface FindAllProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
}

export interface FindAllProductsResult {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IProductsRepository {
  findByNameAndCategory(
    name: string,
    category: string
  ): Promise<Product | null>;
  findByPartialName(name: string): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(options?: FindAllProductsOptions): Promise<FindAllProductsResult>;
  update(id: string, product: Product): Promise<Partial<Product> | null>;
  delete(id: string): Promise<boolean>;
}
