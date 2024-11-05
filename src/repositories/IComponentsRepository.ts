import { Component } from "../entities/Component";

export interface IComponentsRepository {
  findByNameAndManufacturer(
    name: string,
    manufacturer: string
  ): Promise<Component | null>;
  findByPartialName(name: string): Promise<Component[]>;
  save(component: Component): Promise<void>;
  findById(id: string): Promise<Component | null>;
  findAll(params: {
    category?: string;
    page: number;
    perPage: number;
  }): Promise<{
    components: Component[];
    total: number;
  }>;
  update(id: string, component: Partial<Component>): Promise<Component | null>;
  delete(id: string): Promise<boolean>;
}
