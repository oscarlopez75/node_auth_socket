const mongoose = require('mongoose');

const LogSchema = mongoose.Schema({
  script: {
    type: String,
    required: true,
    default: undefined
  },
  errorMessage: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', LogSchema);
