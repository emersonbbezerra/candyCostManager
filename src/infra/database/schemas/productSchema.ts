import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  ingredients: [
    {
      ingredientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
      },
      ingredientName: { type: String, required: false, default: null },
      quantity: Number,
    },
  ],
  productionCost: Number,
  yield: Number,
  unitOfMeasure: String,
  productionCostRatio: Number,
  salePrice: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isIngredient: { type: Boolean, default: false },
});

export const ProductMongoose = mongoose.model("Product", productSchema);
