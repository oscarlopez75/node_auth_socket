var log = require('./log.js');
var User = require('../models/user.model');


var userok = function(username, password, ip){
  return new Promise((resolve, reject) => {
    var message = {};

    var query = { username: username };

    User.find(query)
    .exec()
    .then(function(doc){
      if (doc.length > 0){

        if (doc.length > 1){
          let errorMessage = "More than one user for " + username;
          reject(errorMessage);
          message = {
            script: 'check_user',
            errorMessage: errorMessage
          };
          log.setMessage(message);
        }else{
          var compare = require('./pass_comp');

          compare.checkit(password, doc[0].password, function(mess, result){
            if (result){
              resolve(doc[0].role);
              message = {
                script: 'check_user',
                errorMessage: "User " + username + " login"
              };
              log.setMessage(message);
            }else{
              reject(mess);
              message = {
                script: 'check_user',
                errorMessage: username + " " + mess
              };
              log.setMessage(message);
            }
          });
        }

      }else{
        reject("User " + username + " not found");
        var message = {
          script: 'check_user',
          errorMessage: username + " does not exist"
        };
        log.setMessage(message);
      }
    })
    .catch((err) => {
      reject("Error querying database");
      console.log(err);
    });
  });
}



module.exports.userok = userok;
