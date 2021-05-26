const mongoose = require('mongoose');

const ProcessSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String
  },
  templates: {
    type: [String],
    required: true,
  },
  originalTemp: {
    type: String
  },
  newTemplates: {
    type: [String],
    required: true,
  },
  isUpdated: {
    type: String
  },
  node_ids: {
    type: [String],
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
ProcessSchema.index({
  '$**' : 'text'
});

module.exports = mongoose.model('Process', ProcessSchema);
