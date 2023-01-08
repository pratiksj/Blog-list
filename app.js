const express = require("express");
const App = express();
const cors = require("cors");
//const Blog = require("./model/blog");
//const { response } = require("express");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const commentRouter = require("./controllers/comment");
const middleware = require("./utills/middleware");
App.use(express.static("build"));
App.use(cors());
App.use(express.json());
App.use(middleware.requestLogger);
App.use(middleware.tokenExtractor);
App.use(middleware.userExtractor);
App.use("/api/users", usersRouter);
App.use("/api/login", loginRouter);
App.use("/api/blogs", blogsRouter);
App.use("/api/blogs", commentRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  App.use("/api/testing", testingRouter);
}
App.use(middleware.unknownEndpoint);
App.use(middleware.errorHandler);

module.exports = App;
