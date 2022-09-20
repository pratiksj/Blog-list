const dummy = (blogs) => {
  return 1;
};

const totalLikes = (like) => {
  return like.reduce((previous, currVal) => previous + currVal.likes, 0);
};

// const favoriteBlog = (blog) => {
//   console.log(blog, "hellow");
//   let result = blog.reduce((pre, curr) => {
//     if (blog.length === 1) {
//       pre = {
//         title: curr.title,
//         author: curr.author,
//         likes: curr.likes,
//       };
//     }
//     if (curr.likes >= pre.likes) {
//       pre = {
//         title: curr.title,
//         author: curr.author,
//         likes: curr.likes,
//       };
//     } else {
//       pre = {
//         title: pre.title,
//         author: pre.author,

//         likes: pre.likes,
//       };
//     }

//     console.log("i am in", pre);
//     return pre;
//   }, {});
//   return result;
// };===>
// const favouriteBlog = (blogs) => {
//   if (!blogs.length) return null;

//   let maxLikes = blogs.reduce((a, b) => {
//     if (b.likes > a) return b.likes;
//     else return a;
//   }, 0);

//   let favBlog = blogs.find((blog) => {
//     return blog.likes === maxLikes;
//   });

//   return { title: favBlog.title, author: favBlog.author, likes: favBlog.likes } ====>solutin
// };
const favouriteBlog = (blogs) => {
  const mostliked = blogs.reduce((previousValue, currentValue) => {
    if (blogs.length === 1) {
      previousValue = {
        title: currentValue.title,
        author: currentValue.author,
        likes: currentValue.likes,
      };
    }
    if (previousValue.likes >= currentValue.likes) {
      previousValue = {
        title: previousValue.title,
        author: previousValue.author,
        likes: previousValue.likes,
      };
    } else {
      previousValue = {
        title: currentValue.title,
        author: currentValue.author,
        likes: currentValue.likes,
      };
    }
    console.log(previousValue);
    return previousValue;
  }, {});
  return mostliked;
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
};
