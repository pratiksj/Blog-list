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

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;

    //const user = await User.findById(body.userId);

    if (!body.likes) {
      body.likes = 0;
    }
    //const blog = await Blog.find({title:body.title})

    if (!(body.title || body.url)) {
      response.status(400).json({ error: "tittle and url are required" });
    } else {
      const token = getTokenFrom(request);
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
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
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
    const blog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
      new: true,
    });
    response.status(200).json(blog);
  } catch {
    (error) => next(error);
  }
});

module.exports = blogsRouter;
