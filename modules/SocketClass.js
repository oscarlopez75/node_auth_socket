var check_user = require('./check_user');
var makeToken = require('./makeToken');

class SocketClass {


  constructor(socket){
    this.socket = socket;
    this.connectionData = {
      user: null,
      token: null,
      role: null,
      socketId: this.socket.id
    }


    this.getConUser = () =>{
      return this.connectionData.user;
    }

    this.getConToken = () =>{
      return this.connectionData.token;
    }

    this.getConSocketId = () =>{
      return this.connectionData.socketId;
    }

    console.log('SocketClass new Connection socketId: ' + this.socket.id);

    this.socket.on('userWeb', (data) => {

      this.socket.emit('usercheck', 'Received credentials, validating now')
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
            this.connectionData.user = data.username;
            this.connectionData.token = token;
            this.connectionData.role = role;
          })
        })
        .catch(err => {
          this.socket.emit('usertoken', {
            message: err,
            auth: false
          });
          // socket.disconnect();
        })
    })



    this.socket.conn.on('packet', (packet) =>{
      if(packet.type === "ping"){
        // console.log('Socket ' + socket.id + ' still connected');
        console.log('User: ' + this.getConUser() + ' socketId: ' + this.getConSocketId());
      }

    })
  }




}

module.exports.SocketClass = SocketClass;
