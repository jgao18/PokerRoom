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
//var currentPlayerTurn = 0;
var playerConnected;
var readyPlayers = 0;
var numTimesAccess = 0;

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
	// When client presses the leave button
	client.on("leave", playerLeft);
	// Indicates the turn for the user
	client.on("current turn", currentTurn);
	
	client.on("first turn", firstTurn);
};

// Called by clients when they hit the Play button
function onNewPlayer(data) {
  // Makes a new player with data provided
  
  var newPlayer = new Player(this.id, data.username, data.chips, connectedPlayers.length);
  util.log("New player " + newPlayer.getUsername() + " has been added with " + newPlayer.getChips() + " chips. His index is " + newPlayer.getTableIndex());

  // Player is now a connected player
  connectedPlayers.push(newPlayer);
  currentHandPlayers.push(newPlayer);
  
  var i, existingPlayer;
 
  // Initialize a new list and push 4 players into it.
  outputArray = [];
  for (i = 0; i < maxPlayers; i++)
  {
    outputArray.push(new Player());
  }
  
  // Test the output length.
  util.log("outputArray length: " + outputArray.length);

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

/* The server will keep track of which turn the players are at
   by looking at the the current list of players and modifying 
   it when someone's turn is next. Happens after everyone has accepted game.

   First user comes in
   Signal first user's turn
   First user presses button
   Signal second user's turn

So both players call this function in the beginning +2
User presses the button +1
*/
// Server kepts track of the current Turn
/* Issues:
	- When a user leaves and comes back currentTurn won't work
*/

function firstTurn() {
	numTimesAccess++;
	if ( numTimesAccess ==  currentHandPlayers.length) {
		playerTurn = currentHandPlayers[0];
		currentHandPlayers.splice(0, 1);
		this.emit("current turn", {username: playerTurn.getUsername(),index: playerTurn.getTableIndex()});
		this.broadcast.emit("current turn", {username: playerTurn.getUsername(),index: playerTurn.getTableIndex()});
	}
}

function currentTurn() {
	
	util.log("Coming in the the current turn");
	if (currentHandPlayers.length == 0) {
		this.emit("next action");
		this.broadcast.emit("next action");
		console.log("Going in to copy");
		currentHandPlayers = connectedPlayers.slice();
	}
	
	//currentHandPlayers.splice(0, 1);
	util.log(numTimesAccess);
    playerTurn = currentHandPlayers[0];
    util.log("This is the player " + playerTurn.getUsername());
    currentHandPlayers.splice(0, 1);
	this.emit("current turn", {username: playerTurn.getUsername(),index: playerTurn.getTableIndex()});
	this.broadcast.emit("current turn", {username: playerTurn.getUsername(),index: playerTurn.getTableIndex()});
};

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
};

function playerLeft(data) {
	util.log("Hello!!!!!");
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

// Disconnects each client 
function onClientDisconnect() {
	util.log("Hello!!!!!");
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