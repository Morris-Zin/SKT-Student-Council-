import path from "path";
import express from "express.js";
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
const __dirname = path.resolve();

// Serve the Vite build output
app.use(express.static(path.join(__dirname, "frontend/dist")));

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend/dist/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send(`API/Server running on port ${port}!`);
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));
