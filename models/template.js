const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String
  },
  content: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now()
  },
  likes: {
    type: Number,
    default: 0
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
  messages: [{
    messageBody: {
      type: String,
      required: true,
    },
    messageDate: {
      type: Date,
      default: Date.now()
    },
    messageUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }]

});

// create index for search on all fields
TemplateSchema.index({
  '$**' : 'text'
});

module.exports = mongoose.model('Template', TemplateSchema);
