import express from "express";
import Album from "../models/Album.js";
import RecentPlay from "../models/RecentPlay.js";
import auth, { optionalAuth } from "../middleware/auth.js";

import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// NEW ROUTE
router.get("/featured", async (req, res) => {
  try {
    const albums = await Album.find({
      featured: true,
    });

    res.json(albums);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/trending", async (req, res) => {
  try {
    const albums = await Album.find()
      .sort({ playCount: -1, createdAt: -1 })
      .limit(10);

    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.json([]);
    }

    const albums = await Album.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { artist: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
      ],
    }).limit(20);

    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/recent", auth, async (req, res) => {
  try {
    const recentPlays = await RecentPlay.find({ userId: req.user.userId })
      .sort({ lastPlayedAt: -1 })
      .limit(3)
      .populate("albumId");

    res.json(
      recentPlays.map((recentPlay) => recentPlay.albumId).filter(Boolean),
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/play", optionalAuth, async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true },
    );

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    if (req.user?.userId) {
      await RecentPlay.findOneAndUpdate(
        { userId: req.user.userId, albumId: album._id },
        { lastPlayedAt: new Date() },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    res.json({ playCount: album.playCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/cloudinary-test", async (req, res) => {
  try {
    res.json({
      status: "Cloudinary connected",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        message: "Album not found",
      });
    }

    res.json(album);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const album = await Album.create(req.body);

    res.status(201).json(album);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!album) {
      return res.status(404).json({
        message: "Album not found",
      });
    }

    res.json(album);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);

    if (!album) {
      return res.status(404).json({
        message: "Album not found",
      });
    }

    res.json({
      message: "Album deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
