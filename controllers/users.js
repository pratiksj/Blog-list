const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../model/user");

usersRouter.post("/", async (request, response, next) => {
  try {
    const { username, name, password } = request.body;
    if (username.length < 3 || password.length < 3) {
      response.status(400).send("username and password must be longer than 3");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return response.status(400).json({
        error: "username must be unique",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");
  response.json(users);
});

module.exports = usersRouter;
