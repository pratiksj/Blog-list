const blogsRouter = require("express").Router();
const Blog = require("../model/blog");

blogsRouter.get("/", (request, response) => {
  console.log("get data");

  Blog.find().then((result) => response.json(result));
  //response.json(persons); // response.send response ko method of
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

blogsRouter.post("/", (request, response, next) => {
  const body = request.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  blog
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

blogsRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

blogsRouter.put("./:id", (request, response, next) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedBlog) => {
      response.json(updatedBlog);
    })
    .catch((error) => next(error));
});

// const PORT = 3003;
// blogsRouter.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

module.exports = blogsRouter;