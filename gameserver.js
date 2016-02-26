// http://rawkes.com/articles/creating-a-real-time-multiplayer-game-with-websockets-and-node.html


// We could pass a buffer( or an array ) with the current the deck the players are using
// required imports
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
//var currentPlayerTurn = 0;
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
	// initialize connectedPlayers and currentHandPlayers once server has started.
    connectedPlayers = [];
    currentHandPlayers = [];
	playingPlayers = [];
  playerCards = [];
	userSockets = [];
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

	client.on("buttons", buttons);

	client.on("fold", fold);

	client.on("call", currentTurn);

	client.on("increase pot", potIncrease);

	//client.on("from again", againButton)

	//client.on("call", userCalled);

};

// Called by clients when they hit the Play button
function onNewPlayer(data) {
  // Makes a new player with data provided

  util.log(this.id);
  //userSockets[data.username] = this.id;
  userSockets.push({username: data.username, socket: this });
  util.log("This is what happens: " + userSockets[0].username);
  util.log("The socket id is: " + userSockets[data.username]);

  var newPlayer = new Player(this.id, data.username, data.chips, connectedPlayers.length);
  util.log("New player " + newPlayer.getUsername() + " has been added with " + newPlayer.getChips() + " chips. His index is " + newPlayer.getTableIndex());

  // Player is now a connected player
  playingPlayers.push(newPlayer);
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

  if (connectedPlayers.length ==  2) {

	  this.emit("ready");
	  this.broadcast.emit("ready");
  }

  if (connectedPlayers.length > 2) {
	  this.emit("ready");
  }

};

function potIncrease(data) {
	util.log(data.id);
	util.log("This is how many chips I have: " + data.chips);
	this.emit("add to pot", {chips: data.chips});
	this.broadcast.emit("add to pot", {chips: data.chips});
}

// This is not what I want
function buttons() {

	//util.log("This is the indexPlayer" + indexPlayer);
	//indexPlayer++;
	if (indexPlayer == playingPlayers.length) {
		util.log("It is reverting!");
		indexPlayer = 0;
	}

	this.emit("remove buttons");
	//util.log("Doing buttons");
	//var user = playingPlayers[indexPlayer].getUsername();
	//io.sockets.in(user).emit("add buttons");
	for (var i = 0; i < userSockets.length; i++) {
		if(playingPlayers[indexPlayer].getUsername() == userSockets[i].username) {
			var userSocket = userSockets[i].socket;
			//util.log("This is the socket: " + storeSocket);
			this.emit("signal", {username: userSockets[i].username });
			this.broadcast.emit("signal", {username: userSockets[i].username })
			userSocket.emit("add buttons");
			util.log("Changing buttons");
		}
	}
	indexPlayer++;
	util.log("This is the indexPlayer" + indexPlayer);
	//indexPlayer++;
}

function firstTurn() {
	numTimesAccess++;
	util.log("It is in the first turn");
	if ( numTimesAccess ==  currentHandPlayers.length) {
		//buttons();
		util.log("It is in the first turn if statement");

		var userSocket = userSockets[0].socket;
		userSocket.emit("add buttons");
		playerTurn = currentHandPlayers[0];
		currentHandPlayers.splice(0, 1);

		this.emit("current turn", {username: playerTurn.getUsername(),index: playerTurn.getTableIndex()});
		this.broadcast.emit("current turn", {username: playerTurn.getUsername(),index: playerTurn.getTableIndex()});
	}
}

function fold() {
	for (var i = 0; i < playingPlayers.length; i++) {
		if( playingPlayers[i].id == this.id ) {
			util.log("destroying player");
			playingPlayers.splice(i, 1);
		}
	}

	if (playingPlayers.length == 1) {
		roundOver = true;
		var user = playingPlayers[0];
		this.emit("remove buttons");
		this.broadcast.emit("remove buttons");
		this.emit("winning player", {player: user.getUsername()});
		this.broadcast.emit("winning player", {player: user.getUsername()});
		this.emit("round over");
		this.broadcast.emit("round over");
		playingPlayers = connectedPlayers.slice();
	}
}

function currentTurn() {

	util.log("Coming in the the current turn");

	// If last player folds and there is only one player
	// then don't brodcast next action
	if (currentHandPlayers.length == 0) {
		currentHandPlayers = connectedPlayers.slice();
		if (roundOver == false) {
			this.emit("next action");
			this.broadcast.emit("next action");
			console.log("Going in to copy");
		}
		//currentHandPlayers = connectedPlayers.slice();
	}

	util.log(numTimesAccess);
    playerTurn = currentHandPlayers[0];
    currentHandPlayers.splice(0, 1);
	this.emit("current turn", {username: playerTurn.getUsername(),index: playerTurn.getTableIndex()});
	this.broadcast.emit("current turn", {username: playerTurn.getUsername(),index: playerTurn.getTableIndex()});
};

// users will wait until all players press the ready button
function startGame() {
	util.log("Printing in Start Game");
	readyPlayers++;

  deck = new Deck();
  deck.get_new_deck();

	// something is wrong in connectedPlayers
	util.log(connectedPlayers.length);
	if (readyPlayers == connectedPlayers.length) {
		roundOver = false;
		util.log("Game is ready!");
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
		init();
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
};

function turn() {
	return Math.floor(Math.random()* connectedPlayers.length);
}

init();
