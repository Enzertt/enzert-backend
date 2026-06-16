import mongoose from "mongoose";

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      default: "",
    },

    audioUrl: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
  },
);

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      required: true,
    },

    year: Number,

    description: String,

    featured: {
      type: Boolean,
      default: false,
    },

    tracks: {
      type: [trackSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Album = mongoose.model("Album", albumSchema);

export default Album;
