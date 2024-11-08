import { Component } from '../entities/Component';

export interface FindAllComponentsOptions {
  page?: number;
  limit?: number;
  category?: string;
}

export interface FindAllComponentsResult {
  components: Component[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IComponentsRepository {
  findByNameAndManufacturer(
    name: string,
    manufacturer: string
  ): Promise<Component | null>;
  findByPartialName(name: string): Promise<Component[]>;
  save(component: Component): Promise<void>;
  findById(id: string): Promise<Component | null>;
  findAll(options?: FindAllComponentsOptions): Promise<FindAllComponentsResult>;
  update(id: string, component: Partial<Component>): Promise<Component | null>;
  delete(id: string): Promise<boolean>;
}
