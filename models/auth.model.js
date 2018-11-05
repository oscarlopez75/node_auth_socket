const mongoose = require('mongoose');

const AuthSchema = mongoose.Schema({
  login: {
    type: String,
    required: true
  },
  jti: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
    required: true
  }
});




module.exports = mongoose.model('Auth', AuthSchema);
