const blogsRouter = require("express").Router();
const Blog = require("../model/blog");

blogsRouter.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

const PORT = 3003;
blogsRouter.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = blogsRouter;
