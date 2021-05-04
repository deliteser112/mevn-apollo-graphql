const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  imageUrl: {
    type: String
  },
  categories: {
    type: [String],
    required: true,
  },
  variables: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now()
  },

  /**
   * property('userId') === path
   * ref('User') === model
   */
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

});

// create index for search on all fields
PostSchema.index({
  '$**' : 'text'
});

module.exports = mongoose.model('Post', PostSchema);
