const express = require("express");
const cors = require("cors");
const Blog = require("./model/blog");
const { response } = require("express");
const morgan = require("morgan");

const App = express();
App.use(cors());
App.use(express.json());
App.use(
  // using custom format function
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);
