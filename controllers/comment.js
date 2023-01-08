const Comment = require("../model/comment");
const commentRouter = require("express").Router();

commentRouter.get("/:id/comments", async (request, response) => {
  const comments = await Comment.find();
  response.send(comments);
});

commentRouter.post("/:id/comments", async (request, response) => {
  const remark = new Comment({
    comment: request.body.comment,
  });
  const commentNew = await remark.save();
  response.send(commentNew);
});

module.exports = commentRouter;
