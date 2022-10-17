const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../model/blog");
const User = require("../model/user");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const myBlogs = await Blog.find({}).populate("user");
    response.status(200).json(myBlogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;

    //const user = await User.findById(body.userId);

    if (!body.likes) {
      body.likes = 0;
    }

    if (!(body.title || body.url)) {
      response.status(400).json({ error: "tittle and url are required" });
    } else {
      const token = request.token;
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!decodedToken.id) {
        return response.status(401).json({ error: "token missing or invalid" });
      }
      const user = await User.findById(decodedToken.id);
      if (!user) {
        response.status(401).json({ error: "token missing or invalid" });
      }
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id,
      });
      const newBlog = await blog.save();
      user.blogs = user.blogs.concat(newBlog._id);
      await user.save();
      response.status(201).json(newBlog);
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const user = request.user;
    const blogId = request.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      response.status(404).json({ error: "This id doesn't exist" });
    }
    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(blogId);
      response.status(204).json({ message: "deleted successfully" }).end();
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const body = request.body;
    const newBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    };
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      response.status(404).json({ error: "this id doesn't exist" });
    }
    const data = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
      new: true,
    });
    response.status(200).json(data);
  } catch {
    (error) => next(error);
  }
});

module.exports = blogsRouter;
