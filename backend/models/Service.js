import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    interval: { type: Number, required: true, min: 5 },
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);
