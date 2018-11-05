var check_user = require('./check_user');
var makeToken = require('./makeToken');

let connectionData = {
  user: null,
  token: null,
  socketId: null
}


let getConUser = () =>{
  return connectionData.user;
}

let getConToken = () =>{
  return connectionData.token;
}

let getConSocketId = () =>{
  return connectionData.socketId;
}

const socketService = (socket) => {

  connectionData.socketId = socket.id;
  console.log('New Connection ' + connectionData.socketId);

  socket.on('userWeb', (data) => {

    socket.emit('usercheck', 'Received credentials, validating now')
    check_user.userok(data.username, data.password, data.ip)
      .then((role) => {
        makeToken.makeToken(data.username, role)
        .then((token) => {
          socket.emit('usertoken', {
            username: data.username,
            role: role,
            jwt: token,
            auth: true
          })
          connectionData.user = data.username;
          connectionData.token = token;
        })
      })
      .catch(err => {
        socket.emit('usertoken', {
          message: err,
          auth: false
        });
      })
  })

  socket.on("disconnect", () => {
    console.log('Socket ' + socket.id + ' disconnected');
    connectionData = {
      user: null,
      token: null,
      socketId: null
    }
  })

  socket.conn.on('packet', (packet) =>{
    if(packet.type === "ping"){
      // console.log('Socket ' + socket.id + ' still connected');
      console.log('User: ' + getConUser() + ' socketId: ' + getConSocketId());
    }

  })



}


module.exports.socketService = socketService;
