import { Router } from 'express';
import { createProductController } from '../useCases/productsUseCases/CreateProduct';
import { findProductMethodsController } from '../useCases/productsUseCases/FindProductMethods';
import { updateProductController } from '../useCases/productsUseCases/UpdateProduct';
import { deleteProductController } from '../useCases/productsUseCases/DeleteProduct';

const productsRouter = Router();

productsRouter.post('/products', (req, res, next) => {
  createProductController.handle(req, res, next);
});

productsRouter.get('/products/search', (req, res, next) => {
  findProductMethodsController.findByPartialName(req, res, next);
});

productsRouter.get('/products/:id', (req, res, next) => {
  findProductMethodsController.findById(req, res, next);
});

productsRouter.get('/products', (req, res, next) => {
  findProductMethodsController.findAll(req, res, next);
});

productsRouter.put('/products/:id', (req, res, next) => {
  updateProductController.handle(req, res, next);
});

productsRouter.delete('/products/:id', (req, res, next) => {
  deleteProductController.handle(req, res, next);
});

export { productsRouter };
