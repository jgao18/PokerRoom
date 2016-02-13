// http://rawkes.com/articles/creating-a-real-time-multiplayer-game-with-websockets-and-node.html

// required imports
var util = require("util");
var io = require("socket.io");
var Player = require("./Player").Player;

var socket;
var players;
var connectedPlayers;
var currentHandPlayers;
var maxPlayers;
var currentTurn;
var playerConnected;
var readyPlayers = 0;

function init() {
	// initialize connectedPlayers and currentHandPlayers once server has started.
    connectedPlayers = [];
    currentHandPlayers = [];
    maxPlayers = 4
	
    socket = io.listen(8000);

	// connects with websockets
	socket.configure(function() {
  		socket.set("transports", ["websocket"]);
  		socket.set("log level", 2);
    });

	// runs the function throughout the server's life
    setEventHandlers();
};

// Allows for socket interaction
var setEventHandlers = function() {
    socket.sockets.on("connection", onSocketConnection);
};

// Occurs when a user first connects to poker.html
function onSocketConnection(client) {
	// Printing message
    util.log("New player has connected: " + client.id);
	// When a new player comes in, onNewPlayer runs
    client.on("new player", onNewPlayer);
	// When client disconnects, call onClientDisconnect
    client.on("disconnect", onClientDisconnect);
	// When client presses ready button
	client.on("ready", startGame);
};

// Called by clients when they hit the Play button
function onNewPlayer(data) {
  // Makes a new player with data provided
  
  var newPlayer = new Player(this.id, data.username, data.chips, connectedPlayers.length);
  util.log("New player " + newPlayer.getUsername() + " has been added with " + newPlayer.getChips() + " chips. His index is " + newPlayer.getTableIndex());

  // Player is now a connected player
  connectedPlayers.push(newPlayer);
  
  var i, existingPlayer;
 
  // Initialize a new list and push 4 players into it.
  outputArray = [];
  for (i = 0; i < maxPlayers; i++)
  {
    outputArray.push(new Player());
  }
  
  // Test the output length.
  util.log("outputArray length: " + outputArray.length)
  
  var storePlayer;
  if (connectedPlayers.length == 2) {
	  number = turn();
	  storePlayer = connectedPlayers[number];
	  storePlayer.addChips(200);
	  storePlayer.setPosition(2);
	  //connectedPlayers[number] = storePlayer;
  } 

  // Go through connectedPlayers list and provide the user info
  for (i = 0; i < connectedPlayers.length; i++) {
    existingPlayer = connectedPlayers[i];
    outputArray[existingPlayer.getTableIndex()] = {id: existingPlayer.id, username: existingPlayer.getUsername(), chips: existingPlayer.getChips(), index: existingPlayer.getTableIndex()};
  };
  // Test the new output length.
  util.log("NEW outputArray length: " + outputArray.length)

  // Send playerArray to new player
  this.emit("new player", outputArray);


  // Send playerArray to existing players
  this.broadcast.emit("new player", outputArray);
};

// Server kepts track of the current turn
function currentTurn() {
}

// users will wait until all players press the ready button
function startGame() {
	util.log("Printing in Start Game");
	readyPlayers++;
	if (readyPlayers == connectedPlayers.length) {
		util.log("Game is ready!");
		readyPlayers = 0;
		this.emit("start game");
		this.broadcast.emit("start game");
	}
}

// Disconnects each client 
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

function turn() {
	return Math.floor(Math.random()* connectedPlayers.length);
}

init();
