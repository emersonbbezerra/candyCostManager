import { Router } from "express";
import { createIngredientControler } from "./useCases/CreateIngredient";

const router = Router();

router.post("/ingredients", (req, res) => {
  createIngredientControler.handle(req, res);
});

export { router };
