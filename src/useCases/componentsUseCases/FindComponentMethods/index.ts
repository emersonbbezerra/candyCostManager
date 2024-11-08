import { MongoComponentsRepository } from '../../../repositories/implementations/MongoComponentsRepository';
import { FindComponentMethodsUseCase } from './FindComponentMethodsUseCase';
import { FindComponentMethodsController } from './FindComponentMethodsController';

const mongoComponentsRepository = new MongoComponentsRepository();

const findComponentMethodsUseCase = new FindComponentMethodsUseCase(
  mongoComponentsRepository
);

const findComponentMethodsController = new FindComponentMethodsController(
  findComponentMethodsUseCase
);

export { findComponentMethodsController };
