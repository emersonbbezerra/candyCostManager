import express from "express";
import { componentsRoutes } from "./routes/componentRoutes";
import { productsRouter } from "./routes/productRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(componentsRoutes);
app.use(productsRouter);

app.use(errorHandler);

export { app };
