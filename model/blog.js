const mongoose = require("mongoose");
require("dotenv").config();
const config = require("../utills/config");

const url = config.MONGODB_URI; //local host ko lagi matra ho

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const bloglistSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 5,
    required: true,
  },
  author: {
    type: String,
    required: true,
    minLength: 5,
  },
  url: {
    type: String,
  },
  likes: {
    type: Number,
  },
});

bloglistSchema.set("toJSON", {
  //this is just format
  transform: (document, returnedObject) => {
    //returnedObject ma database bata return vako object hunxa
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Blog", bloglistSchema);
