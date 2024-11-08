import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { componentsRoutes } from './routes/componentRoutes';
import { productsRouter } from './routes/productRoutes';
import { userRoutes } from './routes/userRoutes';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';

dotenv.config();
const app = express();
const corsOptions = {
  origin: process.env.URL_FRONTEND,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(userRoutes);
app.use(componentsRoutes);
app.use(productsRouter);

app.use(errorHandlerMiddleware);

export { app };
