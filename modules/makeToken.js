var nJwt = require('njwt');
var secureRandom = require('secure-random');
var authLog = require('../models/auth.model');
var keyLog = require('../models/key.model');
const mongoose = require('mongoose');


var makeToken = function(username, role){
  return new Promise((resolve, reject) => {

    var signingKey = secureRandom(512, {type: 'Buffer'}); // Create a highly random byte array of 512 bytes

    var claims = {
      login: username,  // The URL of your service
      role: role
    }

    var jwt = nJwt.create(claims,signingKey, 'HS512');
    jwt.setExpiration(new Date().getTime() + (120*60*1000)); // Two hours from now
    var jwtCompact = jwt.compact();
    writeFile(jwt, jwtCompact, signingKey)
      .then(() => {
        resolve(jwtCompact)
      })
      .catch(() =>{
        reject('Could not save to the file')
      })

  });
}

var writeFile = function(jwt, jwtCompact, signingKey){
  return new Promise((resolve, reject) => {
    var base64SigningKey = signingKey.toString('base64');

    const record = new authLog({
      login: jwt.body.login,
      jti: jwt.body.jti,
      role: jwt.body.role,
      token: jwtCompact
    })

    record.save()
      .then(result => {
        const keyrecord = new keyLog({
          jti: jwt.body.jti,
          signingKey: signingKey
        });
        keyrecord.save()
          .then(result =>{
            resolve();
          })
          .catch(err => {
            console.log(err);
            reject();
          })
      })
      .catch(err => {
        console.log(err);
        reject();
      })


  });
}
module.exports.makeToken = makeToken;
