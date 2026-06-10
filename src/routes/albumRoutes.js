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
router.get("/seed", async (req, res) => {
  try {
    await Album.deleteMany({});

    const albums = await Album.insertMany([
      {
        title: "Tizita Classics",
        artist: "Tilahun Gessesse",
        genre: "Traditional",
        coverImage: "/albums/tizita-classics.jpg",
        year: 1975,
        description: "Classic Ethiopian melodies.",
        featured: true,
      },
      {
        title: "Ethiopian Groove",
        artist: "Mulatu Astatke",
        genre: "Ethio Jazz",
        coverImage: "/albums/ethiopian-groove.jpg",
        year: 1972,
        description: "Ethio-jazz masterpieces.",
        featured: true,
      },
      {
        title: "Golden Voice",
        artist: "Mahmoud Ahmed",
        genre: "Traditional",
        coverImage: "/albums/golden-voice.jpg",
        year: 1981,
        description: "Legendary Ethiopian songs.",
        featured: true,
      },
      {
        title: "Aster Collection",
        artist: "Aster Aweke",
        genre: "Modern Ethiopian",
        coverImage: "/albums/aster-collection.jpg",
        year: 1995,
        description: "Popular Ethiopian classics.",
        featured: true,
      },
    ]);

    res.json(albums);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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

export default router;
