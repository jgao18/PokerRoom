// http://rawkes.com/articles/creating-a-real-time-multiplayer-game-with-websockets-and-node.html
var util = require("util");
var io = require("socket.io");
var Player = require("./Player").Player;

var socket;
var players;
var connectedPlayers;
var currentHandPlayers;
var maxPlayers;

function init() {
    connectedPlayers = [];
    currentHandPlayers = [];
    maxPlayers = 4;

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

// Occurs when a user first connects to poker.html
function onSocketConnection(client) {
    util.log("New player has connected: " + client.id);
    client.on("new player", onNewPlayer);
    client.on("disconnect", onClientDisconnect);
};

// Called by clients when they hit the Play button
function onNewPlayer(data) {
  var newPlayer = new Player(this.id, data.username, data.chips, connectedPlayers.length)
  util.log("New player " + newPlayer.getUsername() + " has been added with " + newPlayer.getChips() + " chips. His index is " + newPlayer.getTableIndex());

  connectedPlayers.push(newPlayer);
  var i, existingPlayer;
  outputArray = [];
  for (i = 0; i < maxPlayers; i++)
  {
    outputArray.push(new Player());
  }

  util.log("outputArray length: " + outputArray.length)

  for (i = 0; i < connectedPlayers.length; i++) {
    existingPlayer = connectedPlayers[i];
    outputArray[existingPlayer.getTableIndex()] = {id: existingPlayer.id, username: existingPlayer.getUsername(), chips: existingPlayer.getChips(), index: existingPlayer.getTableIndex()};
  };

  util.log("NEW outputArray length: " + outputArray.length)

  // Send playerArray to new player
  this.emit("new player", outputArray);


  // Send playerArray to existing players
  this.broadcast.emit("new player", outputArray);
};

function onClientDisconnect() {
    util.log("Player has disconnected: " + this.id);

    var i;
    for (i = 0; i < connectedPlayers.length; i++ )
    {
      if (connectedPlayers[i].id == this.id)
      {
        connectedPlayers.splice(i, 1);
        this.broadcast.emit("remove player", {id: this.id});
        break;
      }
    }
};

init();
