import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authenticateUserController } from '../useCases/usersUseCases/AuthenticateUser';
import { createUserController } from '../useCases/usersUseCases/CreateUser';
import { deleteUserController } from '../useCases/usersUseCases/DeleteUser';
import { updateUserController } from '../useCases/usersUseCases/UpdateUser';
import { validateTokenController } from '../useCases/usersUseCases/ValidateToken';

const userRoutes = Router();

userRoutes.post('/users', (req, res, next) => {
  createUserController.handle(req, res, next);
});

userRoutes.post('/users/login', (req, res, next) => {
  authenticateUserController.handle(req, res, next);
});

userRoutes.get('/users/validate-token', authMiddleware, (req, res, next) => {
  validateTokenController.handle(req, res, next);
});

userRoutes.use(authMiddleware);

userRoutes.put('/users/:id', (req, res, next) => {
  updateUserController.handle(req, res, next);
});

userRoutes.delete('/users/:id', (req, res, next) => {
  deleteUserController.handle(req, res, next);
});

export { userRoutes };
