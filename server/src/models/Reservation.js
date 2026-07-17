import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 90 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 32 },
    service: {
      type: String,
      required: true,
      trim: true,
      enum: ["One-Way Trips", "Round Trips", "Hourly Trips", "Airport Pickups", "Package Delivery", "Food Delivery"]
    },
    pickup: { type: String, required: true, trim: true, maxlength: 180 },
    dropoff: { type: String, required: true, trim: true, maxlength: 180 },
    date: { type: String, required: true, maxlength: 20 },
    time: { type: String, required: true, maxlength: 20 },
    notes: { type: String, trim: true, maxlength: 800 }
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
