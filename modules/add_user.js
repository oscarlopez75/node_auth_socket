var validate = require('./check_name_password');
var insert_user = require('./insert_user');


var message = "";
var response = false;

var useradd = function(username, password, role, callback){

  validate.validate(username, password, function(mess, resp){
    if (resp){
      var bcrypt =require('bcrypt');
      var salt = bcrypt.genSaltSync(10);
      var hashpassword = bcrypt.hashSync(password, salt);
      insert_user.insert_user(username, hashpassword, role, function(mess, resp){
        callback(mess, resp);
      });
    }else{
      callback(mess, resp);
    }
  });

};


module.exports.useradd = useradd;
