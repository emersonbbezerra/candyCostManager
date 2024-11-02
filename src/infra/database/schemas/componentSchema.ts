import mongoose from "mongoose";

export const componentSchema = new mongoose.Schema({
  name: String,
  manufacturer: String,
  price: { type: Number, require: true },
  packageQuantity: { type: Number, required: true },
  unitOfMeasure: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ComponentMongoose = mongoose.model("components", componentSchema);
