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
    getTemplates: async (_, args, { Template }) => {
      const templates = await Template.find().sort({ createdDate: 'desc' }).populate({
        path: 'userId',
        model: 'User'
      });
      return templates;
    },
    getSavedTemplates: async (_, args, { Process }) => {
      const templates = await Process.find().sort({ createdDate: 'desc' }).populate({
        path: 'userId',
        model: 'User'
      });
      return templates;
    },
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return post;
    },
    getTemplate: async (_, { templateId }, { Template }) => {
      const template = await Template.findOne({ _id: templateId }).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return template;
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
    getUserReports: async (_, { userId }, { Report }) => {
      const reports = await Report.find({
        userId: userId
      });
      return reports;
    },
    getUserTemplates: async (_, { userId }, { Template }) => {
      const templates = await Template.find({
        userId: userId
      });
      return templates;
    },
    getUserSavedTemplates: async (_, { userId }, { Process }) => {
      const templates = await Process.find({
        userId: userId
      });
      return templates;
    },
  },
  Mutation: {
    addPost: async (
      _,
      { title, imageUrl, categories, variables, description, userId },
      { Post }
    ) => {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        variables,
        description,
        userId,
      }).save();
      return newPost;
    },
    addReport: async (
      _,
      { report_name, report_desc, template_name, file_name, project_id, node_id, variable, previous, modified, userId },
      { Report }
    ) => {
      const newReport = await new Report({
        report_name,
        report_desc,
        template_name,
        file_name,
        project_id,
        node_id,
        variable,
        previous,
        modified,
        userId,
      }).save();
      return newReport;
    },
    addTemplate: async (
      _,
      { title, templateType, content, treeTemplate, filenames, filetypes, userId },
      { Template }
    ) => {
      const newTemplate = await new Template({
        title,
        templateType,
        content,
        treeTemplate,
        filenames,
        filetypes,
        userId
      }).save();
      return newTemplate;
    },
  saveTemplates: async (
      _,
      { title, templateType, templates, originalTemp, newTemplates, isUpdated, node_ids, project_ids, file_names, file_types, userId },
      { Process }
    ) => {
      const newSavedTemplates = await new Process({
        title,
        templateType,
        templates,
        originalTemp,
        newTemplates,
        isUpdated,
        node_ids,
        project_ids,
        file_names,
        file_types,
        userId
      }).save();

      console.log("Here is Resolver")
      return newSavedTemplates;
    },
  updateProcTemplate: async (
      _,
      { templateId, userId, title, templateType, templates, originalTemp, newTemplates, isUpdated, node_ids, project_ids, file_names, file_types },
      { Process }
    ) => {
      const process = await Process.findOneAndUpdate(
        // Find processedTemplate by templateId and createdBy
        { _id: templateId, userId: userId },
        { $set: { title, templateType, templates, originalTemp, newTemplates, isUpdated, node_ids, project_ids, file_names, file_types } },
        { new: true }
      );
      return process;

    },
    updateUserPost: async (
      _,
      { postId, userId, title, imageUrl, categories, variables, description },
      { Post }
    ) => {
      const post = await Post.findOneAndUpdate(
        // Find post by postId and createdBy
        { _id: postId, userId: userId },
        { $set: { title, imageUrl, categories, variables, description } },
        { new: true }
      );
      return post;
    },

    updateUserTemplate: async (
      _,
      { templateId, userId, title, templateType, content, treeTemplate, filenames, filetypes },
      { Template }
    ) => {
      const template = await Template.findOneAndUpdate(
        // Find post by postId and createdBy
        { _id: templateId, userId: userId },
        { $set: { title, templateType, content, treeTemplate, filenames, filetypes } },
        { new: true }
      );
      return template;
    },

    deleteUserPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOneAndRemove({ _id: postId });
      return post;
    },
    deleteUserReport: async (_, { reportId }, { Report }) => {
      const report = await Report.findOneAndRemove({ _id: reportId });
      return report;
    },
    deleteUserTemplate: async (_, { templateId }, { Template }) => {
      const template = await Template.findOneAndRemove({ _id: templateId });
      return template;
    },
    deleteUserSavedTemplate: async (_, { templateId }, { Process }) => {
      const template = await Process.findOneAndRemove({ _id: templateId });
      return template;
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
