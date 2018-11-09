/* SETUP */
const Sequelize = require("sequelize");

const sequelize = new Sequelize("postgres://postgres:5432@localhost/postgres", {
  dialect: "postgres"
});

/* Models CODE */

const User = sequelize.define("user", {
  username: Sequelize.STRING
});

const Post = sequelize.define("post", {
  title: Sequelize.STRING
});

const Comment = sequelize.define("comment", {
  content: Sequelize.STRING
});

Post.Comments = Post.hasMany(Comment);
Comment.User = Comment.belongsTo(User);
User.Comments = User.hasMany(Comment);

const main = async () => {
  try {
    await sequelize.drop();
    await sequelize.sync();

    // /* TEST CODE */

    const newPost = await Post.create(
      {
        title: "Deep association",
        comments: [
          {
            content: "This post really sucks!!",
            user: {
              username: "initFabian"
            }
          },
          {
            content: "Hello",
            user: {
              username: "nickF"
            }
          }
        ]
      },
      {
        include: [
          {
            association: Post.Comments,
            include: [Comment.User]
          }
        ]
      }
    );

    const getAllPosts = async () => {
      const post = await Post.findAll({
        include: [
          {
            model: Comment,
            include: User
          }
        ]
      });

      console.clear();
      console.log("*********************************");

      const output = post.map(el => el.get({ plain: true }));
      console.log(JSON.stringify(output, null, 2));
      console.log("\n\n\n\n\n\n\n\n");
    };

    await getAllPosts();

    setTimeout(() => {
      sequelize.close();
      console.clear();
    }, 5000);
  } catch (e) {
    console.log(e);
  }
};
main();
