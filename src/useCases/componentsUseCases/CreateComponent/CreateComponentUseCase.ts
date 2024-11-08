import { IComponentDTO } from '../../../dtos/ComponentDTO';
import { HttpException } from '../../../utils/HttpException';
import { IComponentsRepository } from '../../../repositories/IComponentsRepository';
import { Component } from '../../../entities/Component';
import { componentSchema } from '../../../utils/componentUtils';

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

    const component = new Component({
      ...parsedData,
      createdAt: parsedData.createdAt?.toISOString(),
      updatedAt: parsedData.updatedAt?.toISOString(),
      packageQuantity: parsedData.packageQuantity,
    });

    await this.componentsRepository.save(component);
  }
}
