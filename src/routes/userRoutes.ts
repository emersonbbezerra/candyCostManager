import { Router } from "express";
import { createUserController } from "../useCases/usersUseCases/CreateUser";
import { authenticateUserController } from "../useCases/usersUseCases/AuthenticateUser";
import { deleteUserController } from "../useCases/usersUseCases/DeleteUser";
import { findUserMethodsController } from "../useCases/usersUseCases/FindUserMethods";
import { updateUserController } from "../useCases/usersUseCases/UpdateUser";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRoutes = Router();

userRoutes.post("/users", (req, res, next) => {
  createUserController.handle(req, res, next);
});

userRoutes.post("/users/login", (req, res, next) => {
  authenticateUserController.handle(req, res, next);
});

userRoutes.use(authMiddleware);

userRoutes.put("/users/:id", (req, res, next) => {
  updateUserController.handle(req, res, next);
});

userRoutes.delete("/users/:id", (req, res, next) => {
  deleteUserController.handle(req, res, next);
});

export { userRoutes };
