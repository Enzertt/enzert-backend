import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema(
  {
    submissionType: {
      type: String,
      enum: ["song", "album", "story"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artistOrigin: {
      type: String,
      required: true,
      trim: true,
    },
    scaleQenet: {
      type: String,
      default: "",
      trim: true,
    },
    historicalContext: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Contribution", contributionSchema);
