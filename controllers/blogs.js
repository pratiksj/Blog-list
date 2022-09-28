const blogsRouter = require("express").Router();
const Blog = require("../model/blog");

blogsRouter.get("/", async (request, response) => {
  const myBlogs = await Blog.find({});
  response.json(myBlogs);
});

blogsRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blogs) => {
      if (blogs) {
        response.json(blogs);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//blogsRouter.post("/api/blogs", (request, response) => {

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
    console.log(request.params.id, "helow");
    const blog = request.params.id;
    await Blog.findByIdAndDelete(blog);
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

// const PORT = 3003;
// blogsRouter.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

module.exports = blogsRouter;
