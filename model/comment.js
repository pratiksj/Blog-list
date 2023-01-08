const mongoose = require("mongoose");
//const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  comment: String,
  //   blog: {
  //     type: Schema.Types.ObjectId,
  //     ref: "Blog",
  //   },
  blog_id: String,
});

// commentSchema.set("toJSON", {
//   //this is just format
//   transform: (document, returnedObject) => {
//     //returnedObject ma database bata return vako object hunxa
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

commentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// const Comment = mongoose.model("Comment", commentSchema); //trying to import commentshema without this part
// module.exports = Comment;
module.exports = mongoose.model("Comment", commentSchema);
