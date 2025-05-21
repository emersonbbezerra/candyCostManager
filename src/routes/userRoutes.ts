import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authenticateUserController } from '../useCases/usersUseCases/AuthenticateUser';
import { createUserController } from '../useCases/usersUseCases/CreateUser';
import { deleteUserController } from '../useCases/usersUseCases/DeleteUser';
import { updateUserController } from '../useCases/usersUseCases/UpdateUser';
import { validateTokenController } from '../useCases/usersUseCases/ValidateToken';

const userRoutes = Router();

import { NextFunction, Request, Response } from 'express';

userRoutes.post('/users', (req: Request, res: Response, next: NextFunction) => {
  createUserController.handle(req, res, next);
});

userRoutes.post(
  '/users/login',
  (req: Request, res: Response, next: NextFunction) => {
    authenticateUserController.handle(req, res, next);
  }
);

userRoutes.get(
  '/users/validate-token',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    validateTokenController.handle(req, res, next);
  }
);

userRoutes.use(authMiddleware);

userRoutes.put(
  '/users/:id',
  (req: Request, res: Response, next: NextFunction) => {
    updateUserController.handle(req, res, next);
  }
);

userRoutes.delete(
  '/users/:id',
  (req: Request, res: Response, next: NextFunction) => {
    deleteUserController.handle(req, res, next);
  }
);

export { userRoutes };
