// http://rawkes.com/articles/creating-a-real-time-multiplayer-game-with-websockets-and-node.html

// required imports for socket.io
var util = require("util");
var io = require("socket.io");
var Player = require("./player").Player;
var Deck = require("./deck").Deck;
var Card = require("./card").Card;

var socket;
var players;
var connectedPlayers;
var currentHandPlayers;
var maxPlayers;
var userSockets;
var playerConnected;
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
    maxPlayers = 4;

	// listens in the port number
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

	// Once players press the Ready Button
	client.on("first turn", firstTurn);

	// Once players press any buttons
	client.on("buttons", buttons);

	// Once players press fold
	client.on("fold", fold);

	// Once players press call
	client.on("call", currentTurn);
	
	// Once players bet
	client.on("increase pot", potIncrease);
	
	// Restart the player list 
	client.on("restart", restartPlayerList);

};

// Called by clients when they hit the Play button
function onNewPlayer(data) {
  
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

  // Once two clients connect, then show the Ready Button
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

	// Precaution for out of index
	if (indexPlayer == playingPlayers.length) {
		indexPlayer = 0;
	}
	
	// Remove the access clients buttons
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
		// Announce the winner of the round to all clients
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

	// If the player raises then until all users fold or call go then don't go to the next
	if (data.action == "raise") {
		
	}
	
	// If all player decided their action for the turn
	if (currentHandPlayers.length == 0) {
		currentHandPlayers = connectedPlayers.slice();
		if (roundOver == false) {
			if (data.action != "raise") {
				this.emit("next action");
				this.broadcast.emit("next action");
			}
			else ()
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
	util.log("Printing here");
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