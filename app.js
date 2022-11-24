const express = require("express");
const cors = require("cors");
//const Blog = require("./model/blog");
const middleware = require("./utills/middleware");
//const { response } = require("express");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const App = express();
App.use(express.static("build"));
App.use(cors());
App.use(express.json());
App.use(middleware.requestLogger);
App.use(middleware.tokenExtractor);
App.use(middleware.userExtractor);
App.use("/api/blogs", blogsRouter);
App.use("/api/users", usersRouter);
App.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  App.use("/api/testing", testingRouter);
}
App.use(middleware.unknownEndpoint);
App.use(middleware.errorHandler);

module.exports = App;
