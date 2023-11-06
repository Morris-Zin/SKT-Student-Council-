import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import {blogs} from "./data/blog.js";
import User from "./models/userModel.js";
import Blog from "./models/blogModel.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const inputData = async () => {
  try {
    await User.deleteMany();
    await Blog.deleteMany();

    const createdUsers = await User.insertMany(users);
    const sampleBlogs = blogs.map((blog) => {
      const randomIndex = Math.floor(Math.random() * 3);
      return { ...blog, author: createdUsers[randomIndex] };
    });

    await Blog.insertMany(sampleBlogs);
    console.log("Data inserted!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const destoryData = async () => {
    try {
      await User.deleteMany();
      await Blog.deleteMany();
      console.log("Data deleted!");
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
}
if(process.argv[2] === "-d") {
    destoryData();
} else {
    inputData();
}