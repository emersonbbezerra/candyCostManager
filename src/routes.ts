import { Router } from "express";
import { createIngredientController } from "./useCases/CreateIngredient";

const router = Router();

router.post("/ingredients", (req, res) => {
  createIngredientController.handle(req, res);
});

export { router };
