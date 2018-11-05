const mongoose = require('mongoose');

const KeySchema = mongoose.Schema({
  jti: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  signingKey: {
    type: Buffer,
    required: true
  }
});




module.exports = mongoose.model('Key', KeySchema);
