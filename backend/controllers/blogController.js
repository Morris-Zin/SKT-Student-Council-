import asyncHandler from "../middlewares/asyncHandler.js";
import Blog from "../models/blogModel.js";

const createComment = async (req, res) => {
  const { data } = req.body;
  const blog = await Blog.findById(req.params.id);
  console.log(req.user._id);
  if (blog) {
    const newComment = {
      comment: data,
      author: req.user._id,
    };
    blog.comments.push(newComment);
    blog.numComments = blog.comments.length;

    const updatedBlog = await blog.save();
    res.status(201).json(updatedBlog.comments);
  } else {
    res.status(404);
    throw new Error("Blog not found");
  }
};
const editComment = async (req, res) => {
  const { data } = req.body;

  const blog = await Blog.findById(req.params.id);
  const comment = blog.comments.id(req.params.commentId);

  if (comment) {
    comment.comment = data;
    //i did it with comment.save(), a mistake happened
    //got stucked
    const updatedBlog = await blog.save();
    res.status(201).json(updatedBlog);
  } else {
    res.status(404);
    throw new Error("Comment not found");
  }
};
const deleteComment = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  const comment = blog.comments.id(req.params.commentId);
  if (comment) {
    blog.comments.pull(comment);
    const updatedBlog = await blog.save();
    res.status(201).json(updatedBlog.comments);
  } else {
    res.status(404);
    throw new Error("Comment not found");
  }
};
// "/api/blogs"
//public
const getBlogs = async (req, res) => {
  let pageSize = 7;
  // query is ?page

  const keyword = req.query.keyword
    ? {
        title: { $regex: req.query.keyword, $options: "i" },
      }
    : {};

  const page = parseInt(req.query.pageNumber) || 1;
  const sortBy = req.query.sortBy || "newest"; // Default to sorting by newest
  let sortCriteria = {};

  if (sortBy === "oldest") {
    sortCriteria = { createdAt: 1 }; // Sort by createdAt in ascending order (oldest first)
  } else if (sortBy === "mostPopular") {
    sortCriteria = { numComments: -1 }; // Sort by numComments in descending order (most comments first)
  } else {
    sortCriteria = { createdAt: -1 }; // Default to sorting by createdAt in descending order (newest first)
  }

  //total number of blogs
  const count = await Blog.countDocuments({ ...keyword });

  let blogs = await Blog.find({ ...keyword })
    .sort(sortCriteria)
    .limit(pageSize)
    .skip((page - 1) * pageSize)
    .populate({
      path: "author",
      select: "name avatar isAdmin",
    });
  res.json({ blogs, page, pages: Math.ceil(count / pageSize) });
};
//"/api/blogs/:id"
//public
const getBlogById = asyncHandler(async (req, res) => {
  const blogPost = await Blog.findById(req.params.id)
    .populate({
      path: "author",
      select: "name avatar isAdmin",
    })
    .populate("comments.author")
    .exec();
  if (blogPost) {
    return res.json(blogPost);
  }
  res.status(404);
  throw new Error("Blog not found");
});

//"/api/blogs
//public
//POST request

const createBlog = asyncHandler(async (req, res) => {
  const { title, content, author, image } = req.body;
  if (!title || !content || !author) {
    throw new Error("All fields are required");
  }
  console.log("I running blog");
  const num = Math.floor(Math.random() * 20) + 1;
  console.log(`image is ${image}- title is ${title} content is ${content}`);

  if (!image) image = `/assets/images/covers/cover_${num}.jpg`;
  try {
    const newBlog = new Blog({
      title,
      content,
      author,
      image,
      numComments: 0,
      comments: [],
    });
    const createdBlog = await newBlog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong and i sadly don't know yet"
    );
  }
});

const editBlog = asyncHandler(async (req, res) => {
  const { title, content, author, image } = req.body;

  const blog = await Blog.findById(req.params.id);
  if (blog) {
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.author = author || blog.author;
    blog.image = image || blog.image;
    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404);
    throw new Error("Blog not found");
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    //cannnot use blog.remove(), have to delete with model
    await Blog.deleteOne({ _id: req.params.id });
    res.json({ message: "Blog removed" });
  } else {
    res.status(404);
    throw new Error("Blog not found");
  }
});

//------------------------------comments  ----------------------------------------------------------------//

//Create a new comment
//POST request
//api/blogs/:id/comments
// private routes --------------------------------

export {
  getBlogs,
  getBlogById,
  deleteBlog,
  editBlog,
  createBlog,
  editComment,
  createComment,
  deleteComment,
};
