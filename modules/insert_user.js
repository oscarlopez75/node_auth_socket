var User       = require('../models/user.model');
const mongoose = require('mongoose');

var insert_user = function(username, password, role, callback){

  const user = new User({
    username: username,
    password: password,
    role: role
  });

  user.save()
  .then(result => {
    callback("User created", true);
  })
  .catch(err => {
    callback(err, false);
  });
};



module.exports.insert_user = insert_user;
