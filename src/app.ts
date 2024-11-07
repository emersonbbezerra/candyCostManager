import express from "express";
import cors from "cors";
import { componentsRoutes } from "./routes/componentRoutes";
import { productsRouter } from "./routes/productRoutes";
import { userRoutes } from "./routes/userRoutes";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";

const app = express();
const corsOptions = {
  origin: process.env.URL_API,
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(userRoutes);
app.use(componentsRoutes);
app.use(productsRouter);

app.use(errorHandlerMiddleware);

export { app };
