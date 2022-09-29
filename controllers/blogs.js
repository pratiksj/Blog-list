const blogsRouter = require("express").Router();
const Blog = require("../model/blog");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const myBlogs = await Blog.find({});
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
  const body = request.body;

  if (!body.likes) {
    body.likes = 0;
  }
  if (!(body.title || body.url)) {
    response.status(400).end();
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });
  try {
    const newBlog = await blog.save();
    response.status(201).json(newBlog);
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
