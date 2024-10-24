import { Router } from "express";
import { createIngredientController } from "./useCases/CreateIngredient";
import { updateIngredientController } from "./useCases/UpdateIngredient";
import { deleteIngredientController } from "./useCases/DeleteIngredient";
import { findMethodsController } from "./useCases/findMethodsIngredient";

const router = Router();

router.post("/ingredients", (req, res) => {
  createIngredientController.handle(req, res);
});

router.get("/ingredients/:id", (req, res) => {
  findMethodsController.findById(req, res);
});

router.get("/ingredients", (req, res) => {
  findMethodsController.findAll(req, res);
});

router.put("/ingredients/:id", (req, res) => {
  updateIngredientController.handle(req, res);
});

router.delete("/ingredients/:id", (req, res) => {
  deleteIngredientController.handle(req, res);
});

export { router };
