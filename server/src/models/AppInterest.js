import mongoose from "mongoose";

const appInterestSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["customer", "driver"],
      required: true
    },
    fullName: { type: String, trim: true, maxlength: 90 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 32 }
  },
  { timestamps: true }
);

export default mongoose.model("AppInterest", appInterestSchema);
