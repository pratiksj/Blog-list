const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../model/blog");
const helper = require("./test_helper");
//const User = require("../model/user");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  // const user = helper.usersInDb();

  // helper.initialBlogs.forEach((blog) => {
  //   blog.user = user.id;
  // });
  const blogObjects = helper.initialBlogs.map((note) => new Blog(note));
  const promiseArray = blogObjects.map((note) => note.save());
  await Promise.all(promiseArray);
});

describe("Initial testing", () => {
  let token;

  beforeEach(async () => {
    const newUser = {
      username: "bharat",
      name: "bharat",
      password: "usha",
    };
    await api.post("/api/users").send(newUser);

    const result = await api.post("/api/login").send(newUser);
    console.log(result.body.token, "mustangiiii");
    token = {
      Authorization: `bearer ${result.body.token}`,
    };
  });
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
      .set(token)
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
      .set(token)
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
    await api.post("/api/blogs").send(blog).set(token).expect(400);
    const blogAtEnd = await helper.blogInDb();

    expect(blogAtEnd).toHaveLength(helper.initialBlogs.length);
  });
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
    //console.log(blogAtStart, "kathamandu");

    const blogToDelete = blogAtStart[0];
    //console.log(blogToDelete, "12");

    await api.delete(`/api/blogs/${blogToDelete.id}`).set(token).expect(204);
    const blogAtEnd = await helper.blogInDb();
    console.log(blogAtEnd, "kathamandu");

    expect(blogAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogAtEnd.map((r) => r.title);

    expect(titles).not.toContain(blogToDelete.title);
  });

  test("updating the blog", async () => {
    const blogAtStart = await helper.blogInDb();

    const title = {
      likes: 10,
    };
    await api
      .put(`/api/blogs/${blogAtStart[0].id}`)
      .set(token)
      .send(title)
      .expect(200);
    const renewBlog = await helper.blogInDb();
    expect(renewBlog[0].likes).toBe(10);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
