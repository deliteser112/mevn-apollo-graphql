const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  report_name: {
    type: String,
    required: true,
  },
  report_desc: {
    type: String,
    required: true,
  },
  template_name: {
    type: [String],
    required: true,
  },
  file_name: {
    type: [String],
    required: true,
  },
  project_id: {
    type: [String]
  },
  node_id: {
    type: [String]
  },
  variable: {
    type: [String]
  },
  previous: {
    type: [String]
  },
  modified: {
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
ReportSchema.index({
  '$**': 'text'
});

module.exports = mongoose.model('Report', ReportSchema);
