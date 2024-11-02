import { Router } from "express";
import { createIngredientController } from "../useCases/ingredientsUseCases/CreateComponent";
import { updateIngredientController } from "../useCases/ingredientsUseCases/UpdateComponent";
import { deleteIngredientController } from "../useCases/ingredientsUseCases/DeleteComponent";
import { findIngredientMethodsController } from "../useCases/ingredientsUseCases/FindComponentMethods";

const ingredientsRoutes = Router();

ingredientsRoutes.post("/ingredients", (req, res) => {
  createIngredientController.handle(req, res);
});

ingredientsRoutes.get("/ingredients/search", (req, res) => {
  findIngredientMethodsController.findByPartialName(req, res);
});

ingredientsRoutes.get("/ingredients/:id", (req, res) => {
  findIngredientMethodsController.findById(req, res);
});

ingredientsRoutes.get("/ingredients", (req, res) => {
  findIngredientMethodsController.findAll(req, res);
});

ingredientsRoutes.put("/ingredients/:id", (req, res) => {
  updateIngredientController.handle(req, res);
});

ingredientsRoutes.delete("/ingredients/:id", (req, res) => {
  deleteIngredientController.handle(req, res);
});

export { ingredientsRoutes };
