import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser,
} from "../controllers/userController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

router.route("/").get(protect, getAllUsers);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.post("/login", authUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUserById)
  .delete(protect, admin, deleteUser);

export default router;
