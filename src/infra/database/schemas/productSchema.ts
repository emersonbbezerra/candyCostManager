import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  ingredients: [
    {
      ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
      },
      quantity: Number,
    },
  ],
  productionCost: Number,
  salePrice: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isIngredient: { type: Boolean, default: false }, // Garantir que o campo `isIngredient` está aqui
});

export const ProductMongoose = mongoose.model("Product", productSchema);
