import { ErrorRequestHandler } from "express";
import { HttpException } from "../utils/HttpException";
import mongoose from "mongoose";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error("[Error]", {
    name: err.name,
    message: err.message,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  // HttpException personalizada
  if (err instanceof HttpException) {
    res.status(err.status).json(err.toJSON());
  }
  // Erros do Mongoose
  else if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      status: 400,
      message: "Validation Error",
      details: Object.values(err.errors).map((error) => error.message),
    });
  } else if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      status: 400,
      message: "Invalid ID format",
      details: err.message,
    });
  }
  // Erros do Zod
  else if (err instanceof ZodError) {
    res.status(400).json({
      status: 400,
      message: "Validation Error",
      details: err.errors,
    });
  }
  // Erro padrão para casos não tratados
  else {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
