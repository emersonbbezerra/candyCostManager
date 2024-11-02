import { Router } from "express";
import { createComponentController } from "../useCases/componentsUseCases/CreateComponent";
import { updateComponentController } from "../useCases/componentsUseCases/UpdateComponent";
import { deleteComponentController } from "../useCases/componentsUseCases/DeleteComponent";
import { findComponentMethodsController } from "../useCases/componentsUseCases/FindComponentMethods";

const componentsRoutes = Router();

componentsRoutes.post("/components", (req, res) => {
  createComponentController.handle(req, res);
});

componentsRoutes.get("/components/search", (req, res) => {
  findComponentMethodsController.findByPartialName(req, res);
});

componentsRoutes.get("/components/:id", (req, res) => {
  findComponentMethodsController.findById(req, res);
});

componentsRoutes.get("/components", (req, res) => {
  findComponentMethodsController.findAll(req, res);
});

componentsRoutes.put("/components/:id", (req, res) => {
  updateComponentController.handle(req, res);
});

componentsRoutes.delete("/components/:id", (req, res) => {
  deleteComponentController.handle(req, res);
});

export { componentsRoutes };
