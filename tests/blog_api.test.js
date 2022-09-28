const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../model/blog");

const api = supertest(app);

const initialBlogs = [
  {
    title: "Practice",
    author: "Niru Kumari",
    url: "this and this",
    likes: 6,
  },
  {
    title: "Arna Buffalo",
    author: "Niru Magar",
    url: "this and that",
    likes: 18,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let noteObject = new Blog(initialBlogs[0]);
  await noteObject.save();
  noteObject = new Blog(initialBlogs[1]);
  await noteObject.save();
});

test(" blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)

    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("a specific blog is within the returned blog", async () => {
  const response = await api.get("/api/blogs");

  const blogTitle = response.body.map((r) => r.title);
  expect(blogTitle).toContain("Practice");
});

afterAll(() => {
  mongoose.connection.close();
});
