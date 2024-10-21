import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: String,
  manufacturer: String,
  price: Number,
  unitOfMeasure: String,
  category: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const IngredientMongoose = mongoose.model(
  "ingredients",
  ingredientSchema
);
