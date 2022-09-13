const express = require("express");
const cors = require("cors");
const Blog = require("./model/blog");
const { response } = require("express");

const App = express();
App.use(cors());
App.use(express.json());
