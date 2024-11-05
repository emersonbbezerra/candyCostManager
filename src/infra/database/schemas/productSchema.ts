import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  components: [
    {
      componentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Component",
      },
      componentName: { type: String, required: false, default: null },
      quantity: Number,
    },
  ],
  productionCost: Number,
  yield: Number,
  unitOfMeasure: String,
  productionCostRatio: Number,
  salePrice: Number,
  isComponent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

productSchema.index({ category: 1, name: 1 });

export const ProductMongoose = mongoose.model("Product", productSchema);
