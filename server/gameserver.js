// http://rawkes.com/articles/creating-a-real-time-multiplayer-game-with-websockets-and-node.html
var util = require("util");
var io = require("socket.io");
Player = require("./Player").Player;


var socket;
var players;

function init() {
    players = [];

    socket = io.listen(8000);
    socket.configure(function() {
    socket.set("transports", ["websocket"]);
    socket.set("log level", 2);
    });

    setEventHandlers();
};

var setEventHandlers = function() {
    socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
    util.log("New player has connected: "+client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
};

function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);
};

function onNewPlayer(data) {
  var newPlayer = new Player();
  newPlayer.setUsername("testUser");
  newPlayer.setPassword("testPassword");
  newPlayer.addChips(1000);
  newPlayer.id = this.id;

  this.broadcast.emit("new player", {id: newPlayer.id, username: newPlayer.getUsername(), chips: newPlayer.getChips()});

  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
      existingPlayer = players[i];
      this.emit("new player", {id: newPlayer.id, username: newPlayer.getUsername(), chips: newPlayer.getChips()});
  };

  players.push(newPlayer);
};

function onMovePlayer(data) {

};

init();
