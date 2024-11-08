import { Component } from '../../../entities/Component';
import {
  FindAllComponentsOptions,
  FindAllComponentsResult,
  IComponentsRepository,
} from '../../../repositories/IComponentsRepository';
import { HttpException } from '../../../utils/HttpException';

export class FindComponentMethodsUseCase {
  constructor(private componentsRepository: IComponentsRepository) {}

  async findAll(
    params: FindAllComponentsOptions = {}
  ): Promise<FindAllComponentsResult> {
    return await this.componentsRepository.findAll({
      page: params.page,
      limit: params.limit,
      category: params.category,
    });
  }

  async findById(id: string): Promise<Component | null> {
    const result = await this.componentsRepository.findById(id);
    if (!result) {
      throw new HttpException(404, 'Component not found');
    }
    return result;
  }

  async findByPartialName(name: string): Promise<Component[]> {
    return await this.componentsRepository.findByPartialName(name);
  }
}
