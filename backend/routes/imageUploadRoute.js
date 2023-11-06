import path, { dirname } from "path";
import express from "express";
import multer from "multer";
import fs from "fs";
import sharp from "sharp";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), async (req, res) => {
  // Optimize the uploaded image using sharp
  sharp(req.file.path)
    .resize(800, 600) // Adjust the dimensions as needed
    .toFile(`uploads/optimized-${req.file.filename}`, (err, info) => {
      if (err) {
        return res.status(500).json({ error: "Error optimizing image" });
      }
      // Delete the original unoptimized image
      fs.unlinkSync(req.file.path);
      res.send({
        message: "Image uploaded and optimized successfully",
        img: `/uploads/optimized-${req.file.filename}`,
      });
    });
});

router.delete("/:img", async (req, res) => {
  try {
    const imageName = req.params.img;
    const imagePath = `uploads/${imageName}`;

    if (!fs.existsSync(imagePath)) {
      return res.status(404).send({ message: "Image not found" });
    }

    fs.unlinkSync(imagePath);

    res.send({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting image" });
  }
});

export default router;
