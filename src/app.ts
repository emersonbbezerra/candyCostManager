import express from "express";
import { componentsRoutes } from "./routes/componentRoutes";
import { productsRouter } from "./routes/productRoutes";
import { userRoutes } from "./routes/userRoutes";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRoutes);
app.use(componentsRoutes);
app.use(productsRouter);

app.use(errorHandlerMiddleware);

export { app };
