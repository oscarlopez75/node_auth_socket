var Log = require('../models/log.model');

var setMessage = function (message) {

  const log = new Log(message);
  log.save()
  .then(result => {
    //console.log(message);
  })
  .catch(err => {
    console.log("Not able to write the log " + message);    
  });
}

module.exports.setMessage = setMessage;
