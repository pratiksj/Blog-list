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

test("Authentication of Id", async () => {
  const response = await api.get("/api/blogs");
  //console.log(response, "hellow i ma here");
  expect(response.body[0].id).toBeDefined();
});

//describe
test("a valid blog can be added", async () => {
  const newBlog = {
    title: "World War",
    author: "Suresh",
    url: "www.dot",
    likes: 20,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const blogTitle = response.body.map((r) => r.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(blogTitle).toContain("World War");
});

test("Adding the new blog without likes key ", async () => {
  const noLikesBlog = {
    title: "Ucoming election",
    author: "Amit shah",
    url: "www.kathmandu",
  };
  await api
    .post("/api/blogs")
    .send(noLikesBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const response = await api.get("/api/blogs");
  const misLikes = response.body.map((r) => r.likes);
  expect(misLikes).toContain(0);
});

test("Title and url are missing", async () => {
  const blog = {
    title: "Binod Shrestha",
    likes: 12,
  };
  await api.post("/api/blogs").send(blog).expect(400);
});
describe("deletion of a blog", () => {
  test("delete the single block post", async () => {
    const blogToDelete = await Blog.find({ title: "Practice" });
    await api.delete(`/api/blogs/${blogToDelete[0]._id}`).expect(204);
    const blogRemain = await Blog.find({});
    const blogTitle = blogRemain.map((r) => {
      return r.title;
    });

    expect(blogTitle).not.toContain("Practice");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
