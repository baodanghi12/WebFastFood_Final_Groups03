import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String }, // Ví dụ: 'Đồ uống', 'Đồ ăn nhẹ', etc.
  },
  { timestamps: true }
);

const Food = mongoose.models.Food || mongoose.model('Food', foodSchema);
export default Food;
