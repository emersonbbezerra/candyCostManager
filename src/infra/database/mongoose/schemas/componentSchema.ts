import mongoose from 'mongoose';

export const componentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  price: { type: Number, required: true },
  packageQuantity: { type: Number, required: true },
  unitOfMeasure: { type: String, required: true },
  category: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

componentSchema.index({ category: 1, name: 1 });

export const ComponentMongoose = mongoose.model('components', componentSchema);
