const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find().sort({ createdDate: 'desc' }).populate({
        path: 'userId',
        model: 'User'
      });
      return posts;
    },
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return post;
    },
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({ email: currentUser.email }).populate({
        path: 'favorites',
        model: 'Post'
      }).populate({
        path: 'favorites',
        model: 'Post'
      })
      return user;
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;
      if (pageNum === 1) {
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "userId",
            model: "User"
          })
          .limit(pageSize);
      } else {
        // If page number is greater than one, figure out how many documents to skip
        const skips = pageSize * (pageNum - 1);
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "userId",
            model: "User"
          })
          .skip(skips)
          .limit(pageSize);
      }
      const totalDocs = await Post.countDocuments();
      const hasMore = totalDocs > pageSize * pageNum;
      return { posts, hasMore };
    },
    searchPosts: async (_, { searchTerm }, { Post }) => {
      if (searchTerm) {
        const searchResults = await Post.find(
          // Perform text search for search value of 'searchTerm'
          { $text: { $search: searchTerm } },
          // Assign 'searchTerm' a text score to provide best match
          { score: { $meta: "textScore" } }
          // Sort results according to that textScore (as well as by likes in descending order)
        )
          .sort({
            score: { $meta: "textScore" },
            likes: "desc"
          })
          .limit(5);
        return searchResults;
      }
    },
    getUserPosts: async (_, { userId }, { Post }) => {
      const posts = await Post.find({
        userId: userId
      });
      return posts;
    },
  },
  Mutation: {
    addPost: async (
      _,
      { title, imageUrl, categories, description, userId },
      { Post }
    ) => {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        userId,
      }).save();
      return newPost;
    },
    updateUserPost: async (
      _,
      { postId, userId, title, imageUrl, categories, description },
      { Post }
    ) => {
      const post = await Post.findOneAndUpdate(
        // Find post by postId and createdBy
        { _id: postId, userId: userId },
        { $set: { title, imageUrl, categories, description } },
        { new: true }
      );
      return post;
    },
    deleteUserPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOneAndRemove({ _id: postId });
      return post;
    },
    addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: userId
      };
      const post = await Post.findOneAndUpdate(
        // find post by id
        { _id: postId },
        // prepend (push) new message to beginning of messages array
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        // return fresh document after update
        { new: true }
      ).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return post.messages[0];
    },
    /**
     * User likes one particular post, post gets added to this User´s favorites posts
     * @param _
     * @param postId
     * @param username
     * @param Post
     * @param User
     * @returns {Promise<{likes: number, favorites: Array}>}
     */
    likePost: async (_, { postId, username }, { Post, User }) => {
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }
      ).populate({
        path: 'favorites',
        model: 'Post'
      });
      return { likes: post.likes, favorites: user.favorites }
    },
    unlikePost: async (_, { postId, username }, { Post, User }) => {
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: postId } },
        { new: true }
      ).populate({
        path: 'favorites',
        model: 'Post'
      });
      return { likes: post.likes, favorites: user.favorites }
    },
    loginUser: async (_, { email, password }, { User }) => {
      const user = await User.findOne({ email }).populate({
        path: 'favorites',
        model: 'Post'
      });
      if (!user) {
        throw new Error('User not found');
      }
      const isValidPassowrd = await bcrypt.compare(password, user.password);

      if (!isValidPassowrd) {
        throw new Error('Wrong Password');
      }
      return { token: createToken(user, process.env.JWT_SALT, '1hr'), user };
    },
    registerUser:
      async (_, { username, email, password }, { User }) => {
        const user = await User.findOne({ username });
        if (user) {
          throw new Error("User already exists");
        }
        const newUser = await new User({
          username,
          email,
          password
        }).save();
        return { token: createToken(newUser, process.env.JWT_SALT, '1hr') };
      }
  }
}
;
