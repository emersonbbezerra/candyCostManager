import express from "express";
import { ingredientsRoutes } from "./routes/ingredientsRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ingredientsRoutes);

export { app };
