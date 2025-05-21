import { IComponentDTO } from '../../../dtos/ComponentDTO';
import { Component } from '../../../entities/Component';
import { IComponentsRepository } from '../../../repositories/IComponentsRepository';
import { componentSchema } from '../../../utils/componentUtils';
import { HttpException } from '../../../utils/HttpException';

export class CreateComponentUseCase {
  constructor(private componentsRepository: IComponentsRepository) {}

  async execute(data: IComponentDTO): Promise<void> {
    const parsedData = componentSchema.parse(data);

    const existingComponent =
      await this.componentsRepository.findByNameAndManufacturer(
        parsedData.name,
        parsedData.manufacturer
      );
    if (existingComponent) {
      throw new HttpException(
        409,
        'Component with this name and manufacturer already exists'
      );
    }

    const componentData = {
      ...parsedData,
      packageQuantity: parsedData.packageQuantity,
    };

    const component = new Component(componentData);
    if (parsedData.createdAt) {
      component.createdAt = new Date(parsedData.createdAt);
    }
    if (parsedData.updatedAt) {
      component.updatedAt = new Date(parsedData.updatedAt);
    }

    await this.componentsRepository.save(component);
  }
}
