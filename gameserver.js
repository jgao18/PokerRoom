// required imports for socket.io
var util = require("util");
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Player = require("./player").Player;
var Deck = require("./deck").Deck;
var Card = require("./card").Card;

var socket;
var serverPort = process.argv[2];
var userSockets;

var players;
var connectedPlayers;
var currentHandPlayers;
var maxPlayers;
var playerConnected;
var raisePlayers;
var readyPlayers = 0;
var numTimesAccess = 0;
var playingPlayers;
var roundOver = false;
var indexPlayer = 1;
var again = 0;

var deck;
var playerCards;


function init() {
  // initialize variables once server starts
  connectedPlayers = [];
  currentHandPlayers = [];
  playingPlayers = [];
  playerCards = [];
  userSockets = [];
  raisePlayers = [];
  maxPlayers = 4

  app.get('/*', function(req, res){
    var file = req.params[0];
      //Send the requesting client the file.
     res.sendFile( __dirname + '/client/' + file );
   });

  io.on('connection', function (socket) {
    socket.emit('welcome', { message: 'Welcome to the poker room, client!' });

		// When a new player comes in, onNewPlayer runs
		socket.on("new player", onNewPlayer);

		// When socket disconnects, call onsocketDisconnect
		socket.on("disconnect", onsocketDisconnect);

		// When socket presses ready button
		socket.on("ready", startGame);

		// When socket presses the leave button
		socket.on("leave", playerLeft);

		// Indicates the turn for the user
		socket.on("current turn", currentTurn);

		// Once players press the Ready Button
		socket.on("first turn", firstTurn);

		// Once players press any buttons
		socket.on("buttons", buttons);

		// Once players press fold
		socket.on("fold", fold);

		// Once players press call
		socket.on("call", currentTurn);

		// Once players bet
		socket.on("increase pot", potIncrease);
  });

  // Thanks to the Nick/the PoP team for helping with this code
	// Set to listen on this ip and this port.
	server.listen(serverPort, '0.0.0.0', function(){
		console.log("Game server started on port " + serverPort);
	});
};

// Called by sockets when they hit the Play button
function onNewPlayer(data) {

  util.log("Found a new player!" + data.username)

  var i, existingPlayer;
  // Stores each user's sockets by username
  userSockets.push({username: data.username, socket: this });


  var newPlayer = new Player(this.id, data.username, data.chips, connectedPlayers.length);

  // Store new player in each list
  playingPlayers.push(newPlayer);
  connectedPlayers.push(newPlayer);
  currentHandPlayers.push(newPlayer);

  // Initialize a new list and push 4 players into it.
  outputArray = [];
  for (i = 0; i < maxPlayers; i++)
  {
    outputArray.push(new Player());
  }

  // Go through connectedPlayers list and provide the user info
  for (i = 0; i < connectedPlayers.length; i++) {
    existingPlayer = connectedPlayers[i];
    outputArray[existingPlayer.getTableIndex()] = {id: existingPlayer.id, username: existingPlayer.getUsername(),
												   chips: existingPlayer.getChips(), index: existingPlayer.getTableIndex()};
  };

  // Send playerArray to new player
  this.emit("new player", outputArray);

  // Send playerArray to existing players
  this.broadcast.emit("new player", outputArray);

  // Once two sockets connect, then show the Ready Button
  if (connectedPlayers.length ==  2) {
	  this.emit("ready");
	  this.broadcast.emit("ready");
  }

  // Once more than two people enter, show Ready Button
  if (connectedPlayers.length > 2) {
	  this.emit("ready");
  }

};

// Increase the pot to all players
function potIncrease(data) {
	this.emit("add to pot", {chips: data.chips});
	this.broadcast.emit("add to pot", {chips: data.chips});
}

//Restart the player list
function restartPlayerList() {
	currentHandPlayers = connectedPlayers.slice();
}

// Provides the turn signal and buttons for players
function buttons(data) {
    
	util.log("Ended in buttons");
	// Precaution for out of index
	if (indexPlayer == playingPlayers.length) {
		indexPlayer = 0;
	}

	// Remove the access sockets buttons
	this.emit("remove buttons");

	// Provide the next player in the list buttons
	for (var i = 0; i < userSockets.length; i++) {
		if(playingPlayers[indexPlayer].getUsername() == userSockets[i].username) {
			// Access the next player's socket
			var userSocket = userSockets[i].socket;
			// Provide that player the turn signal and buttons
			this.emit("signal", {username: userSockets[i].username });
			this.broadcast.emit("signal", {username: userSockets[i].username });
			userSocket.emit("add buttons");
		}
	}
	// next player
	indexPlayer++;

	if (data.remove == true) {
		this.emit("remove buttons");
		this.broadcast.emit("remove buttons");
		return;
	}
}

// Enters this phase once players press the Ready Button
function firstTurn() {
	util.log("Ended in firstTurn");
	
	numTimesAccess++;
	util.log("numTimesAccess is " + numTimesAccess);
	util.log("curentHandPlayers is " + currentHandPlayers.length);
	// Until all users press the ready
	if ( numTimesAccess == currentHandPlayers.length) {
		util.log("Inside the first turn");
		numTimesAccess = 0;
		// Accesses the first client that enters the room
		var userSocket = userSockets[0].socket;
		userSocket.emit("add buttons");
		userSocket.emit("signal", {username: userSockets[0].username});

		// Removes the first player from the remaining round players
		playerTurn = currentHandPlayers[0];
		currentHandPlayers.splice(0, 1);
	}
}

// Removes the player from the round
function fold() {
	util.log("Ended in fold");
	// Find the player and remove him from the round
	for (var i = 0; i < playingPlayers.length; i++) {
		if( playingPlayers[i].id == this.id ) {
			playingPlayers.splice(i, 1);
		}
	}
	
	// If there is only one player left in the round
	if (playingPlayers.length == 1) {
		roundOver = true;
		// Access the currentPlayer
		var user = playingPlayers[0];
		// Remove all buttons
		this.emit("remove buttons");
		this.broadcast.emit("remove buttons");
		// Announce the winner of the round to all sockets
		this.emit("winning player", {player: user.getUsername()});
		this.broadcast.emit("winning player", {player: user.getUsername()});
		// Erase everything
		this.emit("round over");
		this.broadcast.emit("round over");
		// Restart the playing player list
		playingPlayers = connectedPlayers.slice();
	}
}

function currentTurn(data) {
	util.log("Ended in currentTurn");

	// If any player raised
	if (data.action == "raise") {
		util.log("User raised");
		// Make a new list with all players
		currentHandPlayers = playingPlayers.slice();
		// Look for the user that raised and erased him from list
		for (var i = 0; i < currentHandPlayers.length; i++) {
			util.log("This is the currentPlayer: " + currentHandPlayers[i].getUsername());
			util.log("This is the passed Player: " + data.id);
			if(data.id == currentHandPlayers[i].getUsername()) {
				util.log("slicing user");
				currentHandPlayers.splice(i, 1);
			}
		}
	}

	// If all player decided their action for the turn
	if (currentHandPlayers.length == 0) {
		currentHandPlayers = connectedPlayers.slice();
		if (roundOver == false) {
			this.emit("next action");
			this.broadcast.emit("next action");
		}
	}

	// Provide the next player in the list
    playerTurn = currentHandPlayers[0];
    currentHandPlayers.splice(0, 1);
	this.emit("current turn", {username: playerTurn.getUsername(),index: playerTurn.getTableIndex()});
	this.broadcast.emit("current turn", {username: playerTurn.getUsername(),index: playerTurn.getTableIndex()});
};

// Users will wait until all players press the ready button
function startGame() {
	util.log("Ended in startGame");
	
	readyPlayers++;

  	deck = new Deck();
  	deck.get_new_deck();

	if (readyPlayers == connectedPlayers.length) {
		roundOver = false;
		readyPlayers = 0;
    for (i = 0; i < playingPlayers.length; i++)
    {
      var userSocket = userSockets[i].socket;
      var card1 = deck.draw_card();
      var card2 = deck.draw_card();
      playerCards.push(card1, card2);
      userSocket.emit("client cards", {value1 : card1.get_value(), suit1 : card1.get_suit(), value2 : card2.get_value(), suit2 : card2.get_suit()});
    }

    var tableCard1 = deck.draw_card();
    var tableCard2 = deck.draw_card();
    var tableCard3 = deck.draw_card();
    var tableCard4 = deck.draw_card();
    var tableCard5 = deck.draw_card();

    for (i = 0; i < playingPlayers.length; i++)
    {
      var userSocket = userSockets[i].socket;
      userSocket.emit("table cards", {value1 : tableCard1.get_value(), suit1 : tableCard1.get_suit(), value2 : tableCard2.get_value(), suit2 : tableCard2.get_suit(),
        value3 : tableCard3.get_value(), suit3 : tableCard3.get_suit(), value4 : tableCard4.get_value(), suit4 : tableCard4.get_suit(), value5 : tableCard5.get_value(), suit5 : tableCard5.get_suit() });
    }

    outputPlayerCards = [];
    for (i = 0; i < playerCards.length; i++)
    {
      outputPlayerCards.push({value: playerCards[i].get_value(), suit: playerCards[i].get_suit()});
      util.log("outputting" + playerCards[i].get_value() + playerCards[i].get_suit());
    }

    for (i = 0; i < playingPlayers.length; i++)
    {
      var userSocket = userSockets[i].socket;
      userSocket.emit("other cards", outputPlayerCards);
    }
		this.emit("start game");
		this.broadcast.emit("start game");
	}
};

function playerLeft(data) {
	util.log("Ended in playerLeft");
    util.log("Player has disconnected: " + this.id);

    var i;
    for (i = 0; i < connectedPlayers.length; i++ )
    {
      if (connectedPlayers[i].id == this.id)
      {
        connectedPlayers.splice(i, 1);
		this.emit("remove player", {id: this.id});
        this.broadcast.emit("remove player", {id: this.id});
        break;
      }
    }

	if (connectedPlayers.length == 0) {
	    connectedPlayers = [];
	    currentHandPlayers = [];
		playingPlayers = [];
	    playerCards = [];
		userSockets = [];
	}
};

// Disconnects each socket
function onsocketDisconnect() {
	util.log("Ended in onSocketDisconnect");
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

	if (connectedPlayers.length == 0) {
	    connectedPlayers = [];
	    currentHandPlayers = [];
		playingPlayers = [];
	    playerCards = [];
		userSockets = [];
	}
};

function turn() {
	return Math.floor(Math.random()* connectedPlayers.length);
}

init();