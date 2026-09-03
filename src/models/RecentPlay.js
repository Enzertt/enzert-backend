import mongoose from "mongoose";

const recentPlaySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: true,
    },
    lastPlayedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

recentPlaySchema.index({ userId: 1, albumId: 1 }, { unique: true });
recentPlaySchema.index({ userId: 1, lastPlayedAt: -1 });

export default mongoose.model("RecentPlay", recentPlaySchema);
