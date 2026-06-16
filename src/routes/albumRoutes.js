import express from "express";
import Album from "../models/Album.js";

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
