
require('dotenv').config();

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');


var swaggerTools = require('swagger-tools');
var YAML = require('yamljs');
var swaggerDoc = YAML.load('openapi.yaml');

const http = require("http");
const socketIo = require("socket.io");
const socketService = require('./modules/socketService').socketService;
const SocketClass = require('./modules/SocketClass').SocketClass;

var routes = require('./routes/router.js');

var port = process.env.PORT || 8080;        // set our port

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/login', routes);


swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
});

const server = http.createServer(app);
const io = socketIo(server);


io.on('connection', (socket) => {
  // console.log("New connection");
  // socketService(socket);
  let socketClass = new SocketClass(socket);
  console.log('Number of connections ' + io.sockets.server.eio.clientsCount);

  socket.on("disconnect", () => {
    console.log('Socket ' + socket.id + ' disconnected');
    console.log('Number of connections ' + io.sockets.server.eio.clientsCount);
    // socketClass = null;
  })
});

server.listen(port, () => console.log(`Listening on port ${port}`));
