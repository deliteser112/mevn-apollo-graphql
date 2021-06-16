const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  templateType: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  treeTemplate: {
    type: [String]
  },
  filenames: {
    type: [String]
  },
  filetypes: {
    type: [String]
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
TemplateSchema.index({
  '$**' : 'text'
});

module.exports = mongoose.model('Template', TemplateSchema);
