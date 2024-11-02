import express from "express";
import { ingredientsRoutes } from "./routes/componentRoutes";
import { productsRouter } from "./routes/productRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ingredientsRoutes);
app.use(productsRouter);

export { app };
