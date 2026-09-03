import express from "express";
import multer from "multer";
import Contribution from "../models/Contribution.js";
import cloudinary from "../config/cloudinary.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.post("/", optionalAuth, upload.single("file"), async (req, res) => {
  try {
    const {
      submissionType,
      title,
      artistOrigin,
      scaleQenet,
      historicalContext,
    } = req.body;

    if (!submissionType || !title || !artistOrigin || !historicalContext) {
      return res
        .status(400)
        .json({ message: "Please complete all required fields" });
    }

    let fileUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "auto", folder: "enzert/contributions" },
            (error, uploadResult) => {
              if (error) reject(error);
              else resolve(uploadResult);
            },
          )
          .end(req.file.buffer);
      });
      fileUrl = result.secure_url;
    }

    const contribution = await Contribution.create({
      submissionType,
      title,
      artistOrigin,
      scaleQenet,
      historicalContext,
      fileUrl,
      userId: req.user?.userId,
    });

    res
      .status(201)
      .json({
        message: "Contribution submitted for curator review",
        contribution,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
