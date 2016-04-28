// required imports for socket.io
var util = require("util");
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Player = require("./player").Player;
var Deck = require("./deck").Deck;
var Card = require("./card").Card;
var Logic = require("./logic");
var serverPort = process.argv[2];

// stores all sockets per user
var userSockets;
// players that are still in the round (haven't folded)
var playingPlayers;
// all players connected in the game
var connectedPlayers;
// players that haven't decided their turn yet
var currentHandPlayers;
// players that need to wait until round is over
var waitList;
var waitSockets;

const MAX_PLAYERS = 4;
var usernames;
var socket;
var playerCards;
var tableCards;
var gameStage = 0;
var indexPlayer = 1;
var playersReady = 0;
var readyPlayers = 0;
var numTimesAccess = 0;
var roundOver = false;
var game_in_progress = false;

var localUserNames = ["~Antonio", "~Sam", "~Daniel", "~Philip", "~Jessie"];
var localUserCount = 0;

var latestPlayerUsername = localUserNames[localUserCount];
var latestPlayerChipAmount = 1000;

function init() {
	
	// initialize variables once server starts
	connectedPlayers = [];
	currentHandPlayers = [];
	playingPlayers = [];
	playerCards = [];
	tableCards = [];
	userSockets = [];
	usernames = [];
	waitList = [];
	waitSockets = [];

	app.get('/*', function(req, res){
	var file = req.params[0];
	// util.log(file);

	//Send the requesting client the file.
	res.sendFile( __dirname + '/client/' + file );

	});

	app.get('/*', function(req, res){
	  var file = req.params[0];
		util.log(file);
		if (file == "link.php")
			res.sendFile( __dirname + file );
	});


	io.on('connection', function (socket){

		socket.on("new player", onNewPlayer);
		socket.on("disconnect", onsocketDisconnect);
		socket.emit('welcome', { message: latestPlayerUsername + " " + latestPlayerChipAmount });
		socket.on('linkUsername', retrieveUsername);
		socket.on('linkChipAmount', retrieveChipAmount);
		socket.on('disconnectLink', function (data) { util.log(this.id) ;io.sockets.connected[this.id].disconnect(); });
		socket.on("ready", startGame);
		socket.on("current turn", currentTurn);
		socket.on("buttons", buttons);
		socket.on("fold", fold);
		socket.on("call", currentTurn);
		socket.on("first turn", firstTurn);
		socket.on("increase pot", potIncrease);
		socket.on("changed amount", amountChanged);
	
	});

    // Thanks to the Nick/the PoP team for helping with this code
	// Set to listen on this ip and this port.
	server.listen(serverPort, '0.0.0.0', function(){
		console.log("Game server started on port " + serverPort);
	});
	
};

function retrieveUsername(data){
  latestPlayerUsername = data[0];
}

function retrieveChipAmount(data){
  latestPlayerChipAmount = data[0];
}

function changePlayerAmount(user,amount,extra){
	var i;
	var playerAmount;
	var newAmount;

	for(i = 0; i < connectedPlayers.length; i++){
		if(connectedPlayers[i].getUsername() == user){
			if(extra == "pot"){
				newAmount = amount + connectedPlayers[i].getChips();
				connectedPlayers[i].setChips(newAmount);
			}
			else{
				playerAmount = parseInt(connectedPlayers[i].getChips());
				newAmount = playerAmount - parseInt(amount);
				connectedPlayers[i].setChips(amount);
			}
		}
	}
	
}

// Transfers the pot amount to the winner
function amountChanged(data){
	changePlayerAmount(data.id, data.chips,"raise");
	this.emit("change amount",{username: data.id, chips: data.chips});
	this.broadcast.emit("change amount",{username: data.id, chips: data.chips});
}

// Increases the pot amount and player's amount
function potIncrease(data){
	this.emit("last bet", {chips: data.amount})
	this.emit("add to pot", {chips: data.chips, amount: data.amount});
	this.broadcast.emit("add to pot", {chips: data.chips, amount: data.amount});
}

function sortListsByIndex(){
	var i,j;
	var socketList;
	var sortTablePlayers = [];
	for(i = 0; i < connectedPlayers.length; i++){
		for(j = 0; j < connectedPlayers.length; j++){
			if(connectedPlayers[j].getTableIndex() == i){
				sortTablePlayers.push(connectedPlayers[j]);
			}
		}
	}

	connectedPlayers = sortTablePlayers.slice();


	if(game_in_progress == false){
		playingPlayers = sortTablePlayers.slice()
		currentHandPlayers = sortTablePlayers.slice();

		socketList = [];
		for(i = 0; i < connectedPlayers.length; i++){
			for(j = 0; j < userSockets.length; j++){
				if(connectedPlayers[i].getUsername() == userSockets[j].username){
				 	socketList.push(userSockets[j]);
				} 
			}
		}

		userSockets = socketList.slice();
	}
	
}

// Called by sockets when they hit the Play button
function onNewPlayer(data) {
	
  if(connectedPlayers.length > 3) {
		return;
	}

	var i, j;
	var existingPlayer;
	var newPlayer;
	var tableIndex = 0;
	var pStatus;

	// Stores each user's sockets by username in a list
	if (game_in_progress == false) {
		userSockets.push({username: latestPlayerUsername, socket: this });
	}else{
		waitSockets.push({username: latestPlayerUsername, socket: this });
	}

  // Find an unused Table Index
	for(i = 0; i < connectedPlayers.length; i++) {
		if(connectedPlayers[i].getTableIndex() != i){
			tableIndex = i;
			break;
		}
		tableIndex += 1;
	}

	newPlayer = new Player(this.id, latestPlayerUsername, latestPlayerChipAmount, tableIndex);

	connectedPlayers.push(newPlayer);
	sortListsByIndex();
	if(game_in_progress == true){
		waitList.push(newPlayer);
	}
	else{
		usernames.push(newPlayer.getUsername());
	}

	outputArray = [];
	for (i = 0; i < MAX_PLAYERS; i++){
		outputArray.push(new Player());
	}

	// Send all players info to clients
	for (i = 0; i < connectedPlayers.length; i++) {
		existingPlayer = connectedPlayers[i];
		outputArray[existingPlayer.getTableIndex()] = {id: existingPlayer.id, username: existingPlayer.getUsername(),
				    chips: existingPlayer.getChips(), index: existingPlayer.getTableIndex()};
	}

	this.emit("new player", outputArray);
	this.broadcast.emit("new player", outputArray);

	if((!game_in_progress) && connectedPlayers.length == 2){
		this.emit("ready");
		this.broadcast.emit("ready");
	}
	else if((!game_in_progress) && connectedPlayers.length > 2){
		this.emit("ready");
	}

	playersReady++;

	i = 0;
	j = 0;
	var haveUserName = false;
	latestPlayerUsername = localUserNames[0];

	while(!haveUserName){
		if(connectedPlayers[i].getUsername() == latestPlayerUsername){
			i = 0;
			j++;
			latestPlayerUsername = localUserNames[j];
		}
		else{
			i++;
		}

		if(i == connectedPlayers.length){
			haveUserName = true;
		}
	}

};

// Adds waiting players to game
function waitToPlay() {
	var i;
	for(i = 0; i < waitList.length; i++){
		playersReady++;
	}

	for(i = 0; i < waitSockets.length; i++){
		userSocket = waitSockets[i].socket;
		userSocket.emit("again button");
		userSockets.push(waitSockets[i]);
		usernames.push(waitSockets[i].username);
	}
	
	game_in_progress = false;
	sortListsByIndex();
	waitList = [];
	waitSockets = [];
}

// Provides the turn signal and buttons
function buttons(data) {

	var i;
	var userSocket;
	// If the round is over
	if (data.remove == true) {
		this.emit("remove buttons");
		this.broadcast.emit("remove buttons");
		return;
	}

	if (indexPlayer >= playingPlayers.length) {
		indexPlayer = 0;
	}

	this.emit("remove buttons");
	for (i = 0; i < userSockets.length; i++) {
		if(playingPlayers[indexPlayer].getUsername() == userSockets[i].username) {
			userSocket = userSockets[i].socket;
			this.emit("signal", {username: userSockets[i].username });
			this.broadcast.emit("signal", {username: userSockets[i].username });
			userSocket.emit("timer");
			userSocket.emit("add buttons");
		}
	}
	
	indexPlayer++;

	// Retract to the previous index
	if(data.action == "fold") {
		if(indexPlayer > 0 && indexPlayer < playingPlayers.length) {
			indexPlayer--;
		}
	}

	// If the index is out of bounds then revert to 0
	if (indexPlayer >= playingPlayers.length) {
		indexPlayer = 0;
	}
}

function fold(data) {

	// Find the player and remove him from the current round
	for (var i = 0; i < playingPlayers.length; i++) {
		if( playingPlayers[i].getUsername() == data.username ) {
			playingPlayers.splice(i, 1);
		}
	}

	// Check for out of bounds
	if(indexPlayer >= playingPlayers.length) {
		indexPlayer = 0;
	}

	// If there is only one player left
	if (playingPlayers.length == 1) {
		roundOver = true;
		// Access the currentPlayer
		var user = playingPlayers[0];

		this.emit("remove buttons");
		this.broadcast.emit("remove buttons");
		this.emit("winning player", {player: user.getUsername()});
		this.broadcast.emit("winning player", {player: user.getUsername()});
		this.emit("round over", {status: "more than two players"});
		this.broadcast.emit("round over", {status: "more than two players"});
		game_in_progress = false;

		// Restart the playing player list
		playingPlayers = connectedPlayers.slice();
		playerCards = [];
	}
}

// Enters this phase once players press the Ready Button
function firstTurn(data) {

	gameStage = 0;
	indexPlayer = 0;
	playingPlayers = connectedPlayers.slice();
    currentHandPlayers = connectedPlayers.slice();
	
    for(i = 0; i < waitList.length; i++){
      for(j = 0; j < playingPlayers.length; j++){
 	      if(playingPlayers[j].getUsername() == waitList[i].getUsername()){
 	          playingPlayers.splice(j, 1);
		        currentHandPlayers.splice(j,1);
 	      }
      }
    }

	numTimesAccess++;

	// Until all users press the ready
	if ((numTimesAccess == currentHandPlayers.length) && (playersReady > 1)) {
		numTimesAccess = 0;
		var playerTurn = currentHandPlayers[0];
		game_in_progress = true;

		// Prevents giving the current player buttons
		if (playingPlayers[indexPlayer].getUsername() == userSockets[0].username) {
			indexPlayer++;
		}

		// Accesses the first client that enters the room
		var userSocket = userSockets[0].socket;
		userSocket.emit("timer");
		userSocket.emit("add buttons");
		userSocket.emit("signal", {username: userSockets[0].username});

		// Provides the turn signal to all players for first player
		for(var i = 1; i < userSockets.length; i++) {
			userSocket = userSockets[i].socket;
			userSocket.emit("signal", {username: userSockets[0].username});
		}

		// Removes the first player from the remaining turn players
		currentHandPlayers.splice(0, 1);
	}
}


function currentTurn(data) {

	var i;
	var userSocket;
	var round_over = false;
	var gameStages = ["preflop","flop", "turn", "river", "postriver"];

 	if (data.action == "raise") {
 		// Make a new list with all players
 		currentHandPlayers = playingPlayers.slice();
 		// Look for the user that raised and erased him from list
 		for (var i = 0; i < currentHandPlayers.length; i++) {
 			if(data.user == currentHandPlayers[i].getUsername()) {
 				currentHandPlayers.splice(i, 1);
 			}
 		}
 	}

	// If all player decided their action for the turn
	if (currentHandPlayers.length == 0) {
		currentHandPlayers = playingPlayers.slice();
		if (roundOver == false) {
		    gameStage = (gameStage + 1) % 5;
		    stage = gameStages[gameStage];

		    if (stage == "flop")
			{
				for(i = 0; i < userSockets.length; i++){
				  userSocket = userSockets[i].socket;
			      userSocket.emit("flop cards", {value1 : tableCards[0].get_value(), suit1 : tableCards[0].get_suit(), value2 : tableCards[1].get_value(), suit2 : tableCards[1].get_suit(),value3 : tableCards[2].get_value(), suit3 : tableCards[2].get_suit()});
			    }
			}
			else if (stage == "turn")
			{
				for(i = 0; i < userSockets.length; i++){
				  userSocket = userSockets[i].socket;
			      userSocket.emit("turn card", {value : tableCards[3].get_value(), suit : tableCards[3].get_suit()});
			      //userSocket.broadcast.emit("turn card", {value : tableCards[3].get_value(), suit : tableCards[3].get_suit()});
			    }
			}
			else if (stage == "river")
			{
				for(i = 0; i < userSockets.length; i++){
				  userSocket = userSockets[i].socket;
			      userSocket.emit("river card", {value : tableCards[4].get_value(), suit : tableCards[4].get_suit()});
			      //this.broadcast.emit("river card", {value : tableCards[4].get_value(), suit : tableCards[4].get_suit()});
			    }
			}
			else if (stage == "postriver")
			{
				// Player's Card list
			    outputPlayerCards = [];
				var playerHands = {};
				var userResults = {};
				var totalCards = tableCards.slice();
				var times = 0;
				var result;

				// Puts each user cards inside a dictionary {user: {Card1: Card2:}}
				for (var i = 0; i < usernames.length; i++) {
					playerHands[usernames[i]] = {"Card1": playerCards[times], "Card2": playerCards[times+1]};
					times += 2;
				}

				times = 0;

				// Push a dictionary int to the card list with information of each card
			    for (var i = 0; i < playerCards.length; i++)
			    {
					 // inserting the info of the card
			         outputPlayerCards.push({value: playerCards[i].get_value(), suit: playerCards[i].get_suit(), owner: playerCards[i].get_owner()});
			         // Pushing the card value into the logic list
					 totalCards.push(playerCards[i]);
					 times++;

					 if (times == 2) {
						result = Logic.determineHand(totalCards);
						// Stores the results of each user
						userResults[playerCards[i].get_owner()] = result;
						// Restart the card list
						totalCards = tableCards.slice();
						times = 0;
					 }
				 }

				// Iterate through the dictionary and see which is the higher result
				var userPoints = {};
				for (var i = 0; i < usernames.length; i++) {
					var str = userResults[usernames[i]];
					if (str.indexOf("Royal Flush") >= 0) {
						userPoints[usernames[i]] = 11;
					}
					else if(str.indexOf("Straight Flush") >= 0) {
						userPoints[usernames[i]] = 10;
					}
					else if(str.indexOf("four of a kind") >= 0) {
						userPoints[usernames[i]] = 9;
					}
					else if(str.indexOf("Full House") >= 0) {
						userPoints[usernames[i]] = 8;
					}
					else if(str.indexOf("Flush") >= 0) {
						userPoints[usernames[i]] = 7;
					}
					else if(str.indexOf("Low Straight") >= 0) {
						userPoints[usernames[i]] = 5;
					}
					else if(str.indexOf("Straight") >= 0){
						userPoints[usernames[i]] = 6;
					}
					else if(str.indexOf("three of a kind") >= 0) {
						userPoints[usernames[i]] = 4;
					}
					else if(str.indexOf("two pair") >= 0) {
						userPoints[usernames[i]] = 3;
					}
					else if(str.indexOf("pair") >= 0) {
						userPoints[usernames[i]] = 2;
					}
					else if(str.indexOf("High Card") >= 0) {
						userPoints[usernames[i]] = 1;
					}
				}

				var addPoints;
				var user1Cards = tableCards.slice();
				var user2Cards = tableCards.slice();
				for (var i = 0; i < usernames.length; i++) {
					for(var j = 0; j < usernames.length; j++) {
						// If there are multiple of the same results
						if ((userPoints[usernames[i]] == userPoints[usernames[j]]) && (usernames[i] != usernames[j])) {
							// Provide the first user's full card list
							user1Cards.push(playerHands[usernames[i]]["Card1"]);
							user1Cards.push(playerHands[usernames[i]]["Card2"]);
							// Provide the second user's full card list
							user2Cards.push(playerHands[usernames[j]]["Card1"]);
							user2Cards.push(playerHands[usernames[j]]["Card2"]);
							// If the cards are bigger then increase the user points by 0.5
							addPoints = Logic.finalEvaluation(user1Cards,user2Cards,userResults[usernames[i]],userResults[usernames[j]]);
							userPoints[usernames[i]] += addPoints;
							//totalCards = tableCards.slice();
							user1Cards = tableCards.slice();
							user2Cards = tableCards.slice();
						}
					}
				}

				// Decides the winner
				var winner;
				var high = 0;
				for (var i = 0; i < playingPlayers.length; i++) {
					// need to only include from the list playingPlayers
					if (userPoints[playingPlayers[i].getUsername()] > high) {
						winner = playingPlayers[i].getUsername();
						high = userPoints[playingPlayers[i].getUsername()];
					}
				}
				this.emit("winning player",{player: winner});
				this.broadcast.emit("winning player",{player: winner});

				// Inform every player which cards are who's
			    for (var i = 0; i < userSockets.length; i++)
			    {
			         var userSocket = userSockets[i].socket;
			         userSocket.emit("other cards", outputPlayerCards);
			    }

				// Restart the list
			    playerCards = [];
				round_over = true;
			 }
			 
			 for(i = 0; i < userSockets.length; i++){
				 userSocket = userSockets[i].socket;
			     userSocket.emit("next action", gameStages[gameStage]);
			 }
			 
			 if(round_over == true){
			   waitToPlay();
			 }
		 }
	 }

	
 	if (data.action == "raise") {
 		this.emit("player's action", {player: data.user, action: "raised", amount: data.amount});
 		this.broadcast.emit("player's action", {player: data.user, action: "raised", amount: data.amount});
	}
	else if (data.action == "call") {
 		this.emit("player's action", {player: data.user, action: "checked/called", amount: data.amount});
 		this.broadcast.emit("player's action", {player: data.user, action: "checked/called", amount: data.amount});
 	}
	else if (data.action == "fold") {
 		this.emit("player's action", {player: data.user, action: "folded", amount: 0});
 		this.broadcast.emit("player's action", {player: data.user, action: "folded", amount: 0});
 	}

	// Provide the next player in the list
    playerTurn = currentHandPlayers[0];
    currentHandPlayers.splice(0, 1);
	this.emit("current turn", {username: playerTurn.getUsername(),index: playerTurn.getTableIndex()});
	this.broadcast.emit("current turn", {username: playerTurn.getUsername(),index: playerTurn.getTableIndex()});
};

function startGame() {

	readyPlayers++;

	if (readyPlayers >= connectedPlayers.length) {
		roundOver = false;
		readyPlayers = 0;
		var deck = new Deck();
		deck.get_new_deck();

    for (i = 0; i < userSockets.length; i++)
    {
    	var userSocket = userSockets[i].socket;
    	var card1 = deck.draw_card();
    	var user = userSockets[i].username;
    	card1.set_owner(user);
	    var card2 = deck.draw_card();
      card2.set_owner(user);
      playerCards.push(card1, card2);
      userSocket.emit("client cards", {owner: user, value1 : card1.get_value(), suit1 : card1.get_suit(),
								 value2 : card2.get_value(), suit2 : card2.get_suit()});
    }

    tableCards = [deck.draw_card(), deck.draw_card(), deck.draw_card(), deck.draw_card(), deck.draw_card()];

		this.emit("start game");
		this.broadcast.emit("start game");
	}
};

// Disconnects each socket
function onsocketDisconnect() {
    util.log("Player has disconnected: " + this.id);

	var index;
	if(indexPlayer == 0){
	   index = playingPlayers.length - 1;
	}
	else{
		index = indexPlayer - 1;
	}

	if(connectedPlayers.length > 1){
		if((playingPlayers[index].getId() == this.id) && game_in_progress){
			// move the buttons to next player
			for (var i = 0; i < userSockets.length; i++) {
				if(playingPlayers[indexPlayer].getUsername() == userSockets[i].username) {
					var userSocket = userSockets[i].socket;
					// Provide that player the turn signal and buttons
					this.emit("signal", {username: userSockets[i].username });
					this.broadcast.emit("signal", {username: userSockets[i].username });
					userSocket.emit("timer");
					userSocket.emit("add buttons");
					break;
				}
			}
			
			for(var i=0; i < currentHandPlayers.length; i++){
				if(playingPlayers[indexPlayer].getUsername() == currentHandPlayers[i].getUsername()){
				    currentHandPlayers.splice(i, 1);
				}
			}
		}
	}

    var i;
	  var storeDict;
	  var storeSocket;
	  var username;
    for (i = 0; i < connectedPlayers.length; i++ ) {
	  if (connectedPlayers[i].id == this.id) {
		username = connectedPlayers[i].getUsername();
        connectedPlayers.splice(i, 1);
        this.broadcast.emit("remove player", {id: this.id});
      }
    }

	for(i = 0; i < playingPlayers.length; i++) {
  	  if (playingPlayers[i].id == this.id) {
  		  playingPlayers.splice(i,1);
  	  }
	}

	for(i = 0; i < currentHandPlayers.length; i++) {
   	  if (currentHandPlayers[i].id == this.id) {
  	    currentHandPlayers.splice(i,1);
  	  }
	}

	for(i = 0; i < userSockets.length; i++) {
		storeDict = userSockets[i];
		storeSocket = storeDict["socket"];
		if(storeSocket.id == this.id) {
			userSockets.splice(i,1);
		}
	}

	for(i = 0; i < usernames.length; i++){
		if(usernames[i] == username){
			usernames.splice(i,1);
		}
	}

	for(i = 0; i < waitList.length; i++){
		if(waitList[i].id == this.id){
			waitList.splice(i,1);
		}
	}

	for(i = 0; i < waitSockets.length; i++) {
		storeDict = waitSockets[i];
		storeSocket = storeDict["socket"];
		if(storeSocket.id == this.id) {
			waitSockets.splice(i,1);
		}
	}

	//indexPlayer++;
	if (indexPlayer >= playingPlayers.length) {
		indexPlayer = 0;
	}

	if (playingPlayers.length == 1 && game_in_progress) {
		roundOver = true;
		// Access the currentPlayer
		var user = playingPlayers[0];

		this.emit("remove buttons");
		this.broadcast.emit("remove buttons");
		this.emit("winning player", {player: user.getUsername()});
		this.broadcast.emit("winning player", {player: user.getUsername()});
		
		if(connectedPlayers.length == 1){
		  this.emit("round over",{status: "only one player"});
		  this.broadcast.emit("round over",{status: "only one player"});
	    }
		else if(connectedPlayers.length > 1){
  		  this.emit("round over",{status: "more than one player"});
  		  this.broadcast.emit("round over",{status: "more than one player"});
		}

		// Restart the playing player list
		playingPlayers = connectedPlayers.slice();
		game_in_progress = false;
		playerCards = [];
	}
	
	if(playingPlayers.length == 1){
		this.emit("round over",{status: "only one player"});
		this.broadcast.emit("round over",{status: "only one player"});
		readyPlayers = 0;
	}


	if (connectedPlayers.length == 0) {
		waitList = [];
	    connectedPlayers = [];
	    currentHandPlayers = [];
		playingPlayers = [];
	    playerCards = [];
		userSockets = [];
	}
};

init();
