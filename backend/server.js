import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import blogRoute from "./routes/blogsRoute.js";
import userRoute from "./routes/userRoute.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import imageUploadRoutes from "./routes/imageUploadRoute.js";

dotenv.config();
connectDB();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/api/blogs", blogRoute);
app.use("/api/users", userRoute);
app.use("/api/upload", imageUploadRoutes);

// Serve the Vite build output

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();

  app.use("/uploads", express.static("/var/data/uploads"));
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend/dist/index.html"));
  });
} else {
  const __dirname = path.resolve();

  app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

  app.get("/", (req, res) => {
    res.send(`API/Server running on port ${port}!`);
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));
