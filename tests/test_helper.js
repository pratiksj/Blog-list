const Blog = require("../model/blog");
const User = require("../model/user");

const initialBlogs = [
  {
    title: "Practice",
    author: "Niru Kumari",
    url: "this and this",
    likes: 6,
    user: "6347cc005451f5ae2c7672d4",
  },
  {
    title: "Arna Buffalo",
    author: "Niru Magar",
    url: "this and that",
    likes: 18,
    user: "6347cc005451f5ae2c7672d4",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "Into the wild",
    author: "Putin",
    url: "www.online",
    likes: 17,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogInDb = async () => {
  const notes = await Blog.find({});
  return notes.map((note) => note.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogInDb,
  usersInDb,
};
