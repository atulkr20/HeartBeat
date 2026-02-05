import mongoose from "mongoose";

const checkLogSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    status: { type: String, enum: ["UP", "DOWN"], required: true },
    responseTime: { type: Number, required: true },
    checkedAt: { type: Date, required: true },
  },
  { timestamps: false }
);

export const CheckLog = mongoose.model("CheckLog", checkLogSchema);
