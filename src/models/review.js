import { Schema, model } from 'mongoose';

const reviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    testimonial: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const Review = model('Review', reviewSchema);
