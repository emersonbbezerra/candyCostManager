import { IComponentsRepository } from "../../../repositories/IComponentsRepository";
import { HttpException } from "../../../types/HttpException";

export class DeleteComponentUseCase {
  constructor(private componentsRepository: IComponentsRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.componentsRepository.delete(id);
    if (!deleted) {
      throw new HttpException(404, "Component not found");
    }
  }
}
