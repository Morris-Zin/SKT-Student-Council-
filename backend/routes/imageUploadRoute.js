import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

const storage = new multer.memoryStorage();
const upload = multer({
  storage,
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    res.json(cldRes);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
});

router.delete("/:img", async (req, res) => {
  try {
    // You can delete the image on Cloudinary using its public ID
    const publicId = req.params.img.split(".")[0];
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return res.status(500).send({ message: "Error deleting image" });
      }
      res.send({ message: "Image deleted successfully" });
    });
  } catch (error) {
    res.status(500).send({ message: "Error deleting image" });
  }
});

export default router;
