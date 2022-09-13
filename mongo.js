const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}
//console.log(process.env.MONGO)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

//const url = `mongodb+srv://notes-app-full:${password}@cluster1.lvvbt.mongodb.net/?retryWrites=true&w=majority`
const url = `mongodb+srv://pratiksha:${password}@cluster0.cnk2vze.mongodb.net/Phonebook?retryWrites=true&w=majority`;

mongoose
  .connect(url) //yo promise hooo promise resolve vayepachi
  .then((result) => {
    console.log("connected");

    if (process.argv.length > 3) {
      const blog = new Blog({
        title: process.argv[3],
        author: process.argv[4],
        url: process.argv[5],
        likes: process.argv[6],
      });
      blog.save().then((result) => {
        //do not use ".then()" after ".then()", usually it doesn't come one after other, it's rare case
        // result.forEach((note) => {
        //     console.log(note)
        //   })
        // console.log(result);
        console.log(`added ${result.title} ${result.author} to Block-List!`);
        return mongoose.connection.close();
      });
    }
  })
  //   const notes = Note.find({})
  //return person

  .catch((err) => console.log(err));
if (process.argv.length === 3) {
  Blog.find({})
    .then((result) => {
      console.log("Block-list");
      result.forEach((x) => {
        console.log(x.title, x.author);
      });
      console.log("blog saved!");
      return mongoose.connection.close();
    })
    .catch((err) => console.log("this is error ", err.message));
}
