const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app); // supertest le app lai wrap garyo

test(" are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    //.expect("Content-Type", "application/json; charset=utf-8");
    .expect("Content-Type", /application\/json/); // this is regular expression
  // this is regular expression
});

afterAll(() => {
  mongoose.connection.close();
});
