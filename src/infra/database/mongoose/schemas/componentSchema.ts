import mongoose from 'mongoose';

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

componentSchema.index({ category: 1, name: 1 });

export const ComponentMongoose = mongoose.model('components', componentSchema);
