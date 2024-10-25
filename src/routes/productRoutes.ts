import { Router } from "express";
import { createProductController } from "../useCases/productsUseCases/CreateProduct";
import { findProductMethodsController } from "../useCases/productsUseCases/FindProductMethods";
import { updateProductController } from "../useCases/productsUseCases/UpdateProduct";
import { deleteProductController } from "../useCases/productsUseCases/DeleteProduct";

const productsRouter = Router();

productsRouter.post("/products", (req, res) => {
  createProductController.handle(req, res);
});

productsRouter.get("/products/:id", (req, res) => {
  findProductMethodsController.findById(req, res);
});

productsRouter.get("/products", (req, res) => {
  findProductMethodsController.findAll(req, res);
});

productsRouter.put("/products/:id", (req, res) => {
  updateProductController.handle(req, res);
});

productsRouter.delete("/products/:id", (req, res) => {
  deleteProductController.handle(req, res);
});

export { productsRouter };
