// src/useCases/productsUseCases/UpdateProduct/index.ts

import { MongoProductsRepository } from '../../../repositories/implementations/MongoProductsRepository';
import { UpdateProductUseCase } from './UpdateProductUseCase';
import { UpdateProductController } from './UpdateProductController';
import { ProductUpdateManager } from './ProductUpdateManager';

// Criar instância do repositório
const productsRepository = new MongoProductsRepository();

// Criar instância do UpdateProductUseCase
const updateProductUseCase = new UpdateProductUseCase(productsRepository);

// Criar instância do UpdateProductController
const updateProductController = new UpdateProductController(
  updateProductUseCase
);

// Criar instância do ProductUpdateManager
const productUpdateManager = new ProductUpdateManager(productsRepository);

export { updateProductController, productUpdateManager };
