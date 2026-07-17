import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 90 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 32 },
    inquiryType: {
      type: String,
      trim: true,
      default: "General Inquiry",
      enum: [
        "General Inquiry",
        "Customer Support",
        "Sales Inquiry",
        "Business Inquiry",
        "Complaint",
        "Feedback",
        "Technical Support",
        "Billing & Payments",
        "Careers",
        "Media & Press",
        "Other"
      ]
    },
    message: { type: String, required: true, trim: true, maxlength: 1200 }
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
