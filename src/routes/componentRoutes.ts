import { Router } from 'express';
import { createComponentController } from '../useCases/componentsUseCases/CreateComponent';
import { updateComponentController } from '../useCases/componentsUseCases/UpdateComponent';
import { deleteComponentController } from '../useCases/componentsUseCases/DeleteComponent';
import { findComponentMethodsController } from '../useCases/componentsUseCases/FindComponentMethods';

const componentsRoutes = Router();

componentsRoutes.post('/components', (req, res, next) => {
  createComponentController.handle(req, res, next);
});

componentsRoutes.get('/components/search', (req, res, next) => {
  findComponentMethodsController.findByPartialName(req, res, next);
});

componentsRoutes.get('/components/:id', (req, res, next) => {
  findComponentMethodsController.findById(req, res, next);
});

componentsRoutes.get('/components', (req, res, next) => {
  findComponentMethodsController.findAll(req, res, next);
});

componentsRoutes.put('/components/:id', (req, res, next) => {
  updateComponentController.handle(req, res, next);
});

componentsRoutes.delete('/components/:id', (req, res, next) => {
  deleteComponentController.handle(req, res, next);
});

export { componentsRoutes };
