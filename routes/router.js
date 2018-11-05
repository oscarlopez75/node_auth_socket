//https://jwt.io/

var express = require('express');


var check_user = require('../modules/check_user');
var connect = require('../modules/dbConnect');
var useradd = require('../modules/add_user');
var makeToken = require('../modules/makeToken');
var verifyToken = require('../modules/verifyToken');
// var UserVerify = require('../modules/user-verify').UserVerify;


var router = express.Router();


router.use('/', connect.checkCon)


router.get('/', function(req, res){
  res.json({message:"Welcome to the user validation api"});
});


router.post('/', (req, res, next) => {

    check_user.userok(req.body.username, req.body.password, req.ip)
      .then(function(role){
        makeToken.makeToken(req.body.username, role)
          .then((token) => {
            res.status(200).json({
              username: req.body.username,
              role: role,
              jwt: token
            });
          })
          .catch(function(err){
            res.status(400).json({message: err});
          })
      })
      .catch(function(err){
        //console.log("Error from router.js " + err);
        res.status(400).json({message: err});
      });

});


router.post('/newuser', (req, res, next) => {

    check_user.userok(req.body.username, req.body.password, req.ip)
      .then(function(){
        useradd.useradd(req.body.addusername, req.body.addpassword, req.body.addrole, function(message, response){
          if (response){
            res.status(200).json({
              message: message
            });
          }else{
            res.status(400).json({message: message});
          }
        });
      })
      .catch(function(err){
        //console.log("Error from router.js " + err);
        res.status(400).json({message: err});
      });

});

router.get('/checkToken', (req, res, next) => {

  if( req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization') ){
    let token = req.headers.authorization;

    if(token === 'null'){
      return res.status(401).json({error: "Bad Token"});
    }
    verifyToken.verifyToken(token)
      .then(verifiedToken => {
        return res.status(200).json({message: verifiedToken});
      })
      .catch(err => {
        return res.status(403).json({error: err});
      })
  }else{
	console.log('No token')
    return res.status(401).json({error: "No Token"});
  }
});



module.exports = router;
