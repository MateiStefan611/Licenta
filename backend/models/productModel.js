import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  productInfo: { type: String, required: true },
  image: { type: Array, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  type: { type: String, required: true },
  sizes: { type: Array, required: true }, 
  bestSeller: { type: Boolean },
  date: { type: Number, required: true },

  quantity: { 
    type: Map, 
    of: Number, 
    required: true, 
    default: {} 
  },

  lowStockThreshold: { type: Number, required: true},
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
