const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../model/blog");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((note) => new Blog(note));
  const promiseArray = blogObjects.map((note) => note.save());
  await Promise.all(promiseArray);
});

describe("Initial testing", () => {
  test(" blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)

      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await helper.blogInDb();

    expect(response).toHaveLength(helper.initialBlogs.length);
  });

  test("a specific blog is within the returned blog", async () => {
    const response = await helper.blogInDb();

    const blogTitle = response.map((r) => r.title);
    expect(blogTitle).toContain("Practice");
  });

  test("Authentication of Id", async () => {
    const response = await helper.blogInDb();
    console.log(response, "hellow i am here");
    expect(response[0].id).toBeDefined();
  });
});

describe("Creating new Blog with or without likes property and decline the blog without title or url ", () => {
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
      .set(
        "Authorization",
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2MzQ3Y2FjNzliNmI4YWVhMzVjY2ZhZDciLCJpYXQiOjE2NjU2NDkzNzd9.AVvvS6JDdL3hhopH7Il9_YH5aK3x_zspklTPygeVsQc"
      )
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogAtEnd = await helper.blogInDb();
    expect(blogAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const titles = blogAtEnd.map((n) => n.title);
    expect(titles).toContain("World War");
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
      .set(
        "Authorization",
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2MzQ3YzZkNGQwZDU4NzMxNmNjN2Y5NjQiLCJpYXQiOjE2NjU2NDg0MDF9.mlPPnOZ5uDj9aCNgbmV_ZGL39Dn8EmtRAneIlsKRBiQ"
      )
      .expect(201)
      .expect("Content-Type", /application\/json/);
    //const response = await api.get("/api/blogs");
    const blogAtEnd = await helper.blogInDb();

    //const misLikes = response.body.map((r) => r.likes);
    const misLikes = blogAtEnd.map((r) => r.likes);
    expect(misLikes).toContain(0);
  });

  test("Blog without title or url is not added ", async () => {
    const blog = {
      title: "Binod Shrestha",
      likes: 12,
    };
    await api
      .post("/api/blogs")
      .send(blog)
      .set(
        "Authorization",
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2MzQ3YzZkNGQwZDU4NzMxNmNjN2Y5NjQiLCJpYXQiOjE2NjU2NDg0MDF9.mlPPnOZ5uDj9aCNgbmV_ZGL39Dn8EmtRAneIlsKRBiQ"
      )
      .expect(400);
    const blogAtEnd = await helper.blogInDb();

    expect(blogAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe(" fetching and deletion of a blog and updating the blog", () => {
  test("a specific blog can be viewed", async () => {
    const blogAtStart = await helper.blogInDb();

    const blogToView = blogAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    //const processedblogToView = JSON.parse(JSON.stringify(blogToView));

    expect(resultBlog.body).toEqual(blogToView);
  });

  test("a blog can be deleted", async () => {
    const blogAtStart = await helper.blogInDb();
    const blogToDelete = blogAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(
        "Authorization",
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2MzQ3Y2MwMDU0NTFmNWFlMmM3NjcyZDQiLCJpYXQiOjE2NjU2NTAwMzd9.39MpdUdJD9jyYcEqPfP1k2mmseLOrn3PGez5itqYr_Y"
      )
      .expect(204);

    const blogAtEnd = await helper.blogInDb();

    expect(blogAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogAtEnd.map((r) => r.title);

    expect(titles).not.toContain(blogToDelete.title);
  });

  test.only("updating the blog", async () => {
    const blogAtStart = await helper.blogInDb();

    const title = {
      likes: 10,
    };
    await api
      .put(`/api/blogs/${blogAtStart[1].id}`)
      .set(
        "Authorization",
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2MzQ3Y2MwMDU0NTFmNWFlMmM3NjcyZDQiLCJpYXQiOjE2NjU5ODE1MDl9.7OOlJMI4866rF5uiw1QTt4pviJWjTpzvxMTGJWZVMY0"
      )
      .send(title)
      .expect(200);
    const renewBlog = await helper.blogInDb();
    expect(renewBlog[1].likes).toBe(10);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
