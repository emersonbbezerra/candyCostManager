import { MongoComponentsRepository } from '../../../repositories/implementations/MongoComponentsRepository';
import { DeleteComponentUseCase } from './DeleteComponentUseCase';
import { DeleteComponentController } from './DeleteComponentController';

const mongoComponentsRepository = new MongoComponentsRepository();

const deleteComponentUseCase = new DeleteComponentUseCase(
  mongoComponentsRepository
);

const deleteComponentController = new DeleteComponentController(
  deleteComponentUseCase
);

export { deleteComponentController };
