import express from "express";
import { componentsRoutes } from "./routes/componentRoutes";
import { productsRouter } from "./routes/productRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(componentsRoutes);
app.use(productsRouter);

export { app };
