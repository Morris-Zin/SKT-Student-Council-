import express from "express";
const router = express.Router();
import {
  getBlogs,
  getBlogById,
  createBlog,
  editBlog,
  deleteBlog,
  createComment,
  editComment,
  deleteComment,
} from "../controllers/blogController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.route("/").get(getBlogs).post(protect, createBlog);
router
  .route("/:id")
  .get(getBlogById)
  .put(protect, editBlog)
  .delete(protect, deleteBlog); 
router.route("/:id/comments").post(protect, createComment);
router.route("/:id/comments/:commentId").put(protect, editComment);
router.route("/:id/comments/:commentId").delete(protect, deleteComment);
export default router;
