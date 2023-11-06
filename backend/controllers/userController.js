import asyncHandler from "../middlewares/asyncHandler.js";
import generateToken from "../utils/generateJWTtoken.js";
import User from "../models/userModel.js";
import Blog from "../models/blogModel.js";
import jwt from "jsonwebtoken";

//auth - user & get token -- LOGGING IN ROUTE
//@route POST /api/users/login
// public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//auth - register user
//@route POST /api/users/
// public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, yearClass } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const random = Math.floor(Math.random() * 25) + 1;
  const user = await User.create({
    name,
    email,
    password,
    yearClass,
    avatar: `/assets/images/avatars/avatar_${random}.jpg`,
  });

  if (user) {
    let userId = user._id;

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    // Set JWT as an HTTP-Only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
// log out user
// POST clear jwt cookei
//api/users/logout
// private route
const logoutUser = asyncHandler(async (req, res) => {
  console.log("from logo out", req.cookies.jwt);
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "You have been logged out sir/madam" });
});

// Get user profile
// get /api/users/profile
//private route
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
    });
  } else {
    res.status(404);
    throw new Error("User not found 😾");
  }
});

// Update user profile
// Put /api/users/profile
// Private route
const updateUserProfile = asyncHandler(async (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  console.log("I runn");
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    user.isAdmin = req.body.isAdmin || user.isAdmin;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
    });
  } else {
    res.status(404);
    throw new Error("User not found 😾");
  }
});

// ==========================ADMIN STARTING FROM NOW====================================
//get users
// get /api/users
// ADMIN ONLY ----
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

//get user by id
// get /api/users/:id
// ADMIN ONLY ----
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found 😾");
  }
});

// update user by id
// Put /api/users/:id
// ADMIN ONLY
const updateUserById = asyncHandler(async (req, res) => {
  console.log("I am here");
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    user.isAdmin = Boolean(req.body.isAdmin);
    user.yearClass = req.body.yearClass || user.yearClass;
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
    });
  } else {
    res.status(404);
    res.json({ message: "User not found" });
  }
});

// delete user
// Delete /api/users/:id
// ADMIN ONLY ----
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("You can't delete admin user");
    }

    await Blog.deleteMany({ author: user._id });
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found 😾");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser,
};
