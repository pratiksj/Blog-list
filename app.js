const express = require("express");
const cors = require("cors");
//const Blog = require("./model/blog");
const middleware = require("./utills/middleware");
//const { response } = require("express");
const blogsRouter = require("./controllers/blogs");
const App = express();
App.use(cors());
App.use(express.json());
App.use(middleware.requestLogger);
App.use("/blogs", blogsRouter);
App.use(middleware.unknownEndpoint);
App.use(middleware.errorHandler);

module.exports = App;
