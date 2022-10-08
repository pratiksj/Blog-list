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
});

describe("verify unique identifier property of the blog post ", () => {
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
    await api.post("/api/blogs").send(blog).expect(400);
    const blogAtEnd = await helper.blogInDb();

    expect(blogAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe(" fetching and deletion of a blog", () => {
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

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogAtEnd = await helper.blogInDb();

    expect(blogAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogAtEnd.map((r) => r.title);

    expect(titles).not.toContain(blogToDelete.title);
  });
});
describe("Upgrading the blog", () => {
  test("updating the blog", async () => {
    const blogAtStart = await helper.blogInDb();

    const title = {
      likes: 10,
    };
    await api.put(`/api/blogs/${blogAtStart[0].id}`).send(title).expect(200);
    const renewBlog = await helper.blogInDb();
    expect(renewBlog[0].likes).toBe(10);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
