import { IComponentsRepository } from "../../../repositories/IComponentsRepository";
import { Component } from "../../../entities/Component";
import { HttpException } from "../../../utils/HttpException";

export class FindComponentMethodsUseCase {
  constructor(private componentsRepository: IComponentsRepository) {}

  async findAll(params: {
    category?: string;
    page: number;
    perPage: number;
  }): Promise<{
    components: Component[];
    total: number;
  }> {
    return await this.componentsRepository.findAll(params);
  }

  async findById(id: string): Promise<Component | null> {
    const result = await this.componentsRepository.findById(id);
    if (!result) {
      throw new HttpException(404, "Component not found");
    }
    return result;
  }

  async findByPartialName(name: string): Promise<Component[]> {
    try {
      return await this.componentsRepository.findByPartialName(name);
    } catch (error) {
      throw error;
    }
  }
}
