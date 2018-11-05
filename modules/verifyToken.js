var nJwt = require('njwt');
var authLog = require('../models/auth.model');
var keyLog = require('../models/key.model');
var Base64 = require('js-base64').Base64;


var verifyToken = function(token){
  return new Promise((resolve, reject) => {

    try {
      var payLoadUrl = token.split('.')[1];
      var payLoadBase64 = payLoadUrl.replace('-', '+').replace('_', '/');
      var payLoad = JSON.parse(Base64.decode(payLoadBase64));
    } catch (e) {
      console.log(e);
      reject('Unexpected payload')
    }


    var query = {jti: payLoad.jti};

    keyLog.find(query)
      .exec()
      .then((doc) => {
        if(doc.length == 1){
          nJwt.verify(token,doc[0].signingKey, 'HS512', function(err,verifiedJwt){
            if(err){
              reject(err); // Token has expired, has been tampered with, etc
            }else{
              resolve(verifiedJwt); // Will contain the header and body
            }
          });
        }else{
          reject('No key or more than one found')
        }
      })
      .catch(err =>{
        console.log(err);
        reject(err);
      })

    // {"login":"Oscar","role":"admin","jti":"d03bfd75-4720-4438-b364-05df5c58713d","iat":1537036548,"exp":1537040148}



  });
}


module.exports.verifyToken = verifyToken;
