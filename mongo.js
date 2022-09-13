const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

//const url = `mongodb+srv://notes-app-full:${password}@cluster1.lvvbt.mongodb.net/?retryWrites=true&w=majority`;
const url = `mongodb+srv://pratiksha:${password}@cluster0.cnk2vze.mongodb.net/Blog?retryWrites=true&w=majority`;

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");

    const blog = new Blog({
      title: "Javascipt is exciting",
      author: "Ram Babu",
      likes: "3",
    });

    return blog.save();
  })
  .then(() => {
    console.log("block saved!");
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));
