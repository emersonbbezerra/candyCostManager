import { Router } from "express";
import { createIngredientController } from "../useCases/CreateIngredient";
import { updateIngredientController } from "../useCases/UpdateIngredient";
import { deleteIngredientController } from "../useCases/DeleteIngredient";
import { findMethodsController } from "../useCases/findMethodsIngredient";

const ingredientsRoutes = Router();

ingredientsRoutes.post("/ingredients", (req, res) => {
  createIngredientController.handle(req, res);
});

ingredientsRoutes.get("/ingredients/:id", (req, res) => {
  findMethodsController.findById(req, res);
});

ingredientsRoutes.get("/ingredients", (req, res) => {
  findMethodsController.findAll(req, res);
});

ingredientsRoutes.put("/ingredients/:id", (req, res) => {
  updateIngredientController.handle(req, res);
});

ingredientsRoutes.delete("/ingredients/:id", (req, res) => {
  deleteIngredientController.handle(req, res);
});

export { ingredientsRoutes };
