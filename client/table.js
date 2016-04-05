var stage, canvas;
var width, height;
var deck;
var socket;
var currentPlayer;
var currentPlayers;
var maxPlayers;
var playerIndex;
var numPlayers = 0;
//var tableCardsPass = false;
var numOfTimes = 0;
var playerIterator = 0;
var action = 0;
var amountBet = 0;
var currentBetAmount = 0;
var currentUserBet = 0;
var lastUserBet = 0;
var lastBetAmount = 0;
var pot_amount = 0;
var positions = {};
var card1;
var card2;
var tableCard1;
var tableCard2;
var tableCard3;
var tableCard4;
var tableCard5;
var passedFirstCard = false;
var otherCards;

// Holds all items for the game
var game_menu = new createjs.Container();

// Will incoporate this function for starting games with
// with a random user
function randomUserStart() {
	return Math.floor(Math.random()* numPlayers);
}

function getTotalBet() {
	return currentBetAmount;
}

function getLastBetAmount() {
	return lastBetAmount;
}

function betDifference(amount) {
	console.log("Passing in the amount :" + amount);
	console.log("currentUserBet :" + currentUserBet);
	return (amount - currentUserBet);
}

function setLastUserBet(data) {
	lastUserBet = data.chips;
}

function getLastUserBet() {
	return lastUserBet;
}

/*function setCurrentUserBet(data) {
	currentUserBet = data.chips;
}*/

function getPotAmount() {
	return pot_amount;
}

function setPotToZero() {
	pot_amount = 0;
	pot(0);
}

function getNumPlayers() {
	return numPlayers;
}

function getAmountBet() {
	return amountBet;
}

function getCurrentPlayer() {
	return currentPlayer.getUsername();
}

function setAmountBet(num) {
	amountBet = num;
}

function removePlayerChips(amount) {
	currentPlayer.deleteChips(amount);
}

function getPlayerChips() {
	return currentPlayer.getChips();
}

// Adds object to Game Container
function addToGame(object) {
	game_menu.addChild(object);
	stage.update();
}

// Deletes item from Game Container
function deleteItemFromGame(object) {
	game_menu.removeChild(object);
	stage.update();
}

function removeGameChildren() {
	game_menu.removeAllChildren();
	stage.update();
}


function game_init() {

	deck = new Deck();
	deck.get_new_deck();
	otherCards = [];
	currentPlayers = [];
	maxPlayers = 4;

	// Creating the stage
	stage = new createjs.Stage("demoCanvas");

	// Loading the background image
	backgroundFelt();
	stage.addChild(game_menu);

	// Get dimensions of Canvas
	canvas = document.getElementById('demoCanvas');
	width = canvas.width;
	height = canvas.height;

	// Fills the array with Players
	for (i = 0; i< maxPlayers; i++)
	{
		currentPlayers.push(new Player());
	}

	// Changes the pace of the Tickers
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.setFPS(60);
	
	/*$.ajax({  
    type: 'POST',  
    url: '../php/holdemRooms.php', 
    data: { "username": "amount" },
    success: function( response ) {
       console.log( response );
    }
 });*/

	// Assigns the information for the client
	currentPlayer = new Player();
	//currentPlayer.setUsername("testUser" + Math.floor((Math.random() * 100) + 1));
	//currentPlayer.setPassword("testPassword" + Math.floor((Math.random() * 10) + 1));
	//currentPlayer.addChips(Math.floor((Math.random() * 10000) + 1));
	var myPhpValue = $("#myPhpValue").val();
	
	currentPlayer.setUsername(myPhpValue);

  // The menu automatically starts
  menu();
}

//Indicates what cards have been used
function otherCardsFunction(data) {

	// Saves the array of cards from the server
	inputPlayerCards = data;
	temp = [];

	// Inserts new card objects by using the server information
	for (i = 0; i < inputPlayerCards.length; i++)
	{
		temp.push(new Card(inputPlayerCards[i].value, inputPlayerCards[i].suit, inputPlayerCards[i].owner))
	}

	// Pushes all other cards from the temp list into a global list
	for (i = 0; i < temp.length; i++)
	{
		if ( (temp[i].get_value() != card1.get_value()) || (temp[i].get_suit() != card1.get_suit())  )
		{
			if ( (temp[i].get_suit() != card2.get_suit()) || (temp[i].get_value() != card2.get_value()) )
			{
				otherCards.push(temp[i]);
			}
		}
	}
}

// produces the player cards
function assignCards(data)
{
	card1 = new Card(data.value1, data.suit1, data.owner);
	card2 = new Card(data.value2, data.suit2, data.owner);
}

function flopCards(data)
{
	tableCard5 = new Card(data.value1, data.suit1);
	tableCard4 = new Card(data.value2, data.suit2);
	tableCard3 = new Card(data.value3, data.suit3);
}

function turnCard(data)
{
	tableCard2 = new Card(data.value, data.suit);
}

function riverCard(data)
{
	tableCard1 = new Card(data.value, data.suit);
}

// Connects the client to the server
function onSocketConnected() {
  console.log(this);
  console.log("Client connected!");
}

// Gets called when new player joins.
function onNewPlayer(data)
{
  // The server sends a list of players to the client
  playerList = data;

  for (i = 0; i < playerList.length; i++)
  {
	// Makes a new player with current iteration information
    var existingPlayer = new Player(playerList[i].id, playerList[i].username, playerList[i].chips, playerList[i].index);
	// If player is a connected user
    if (existingPlayer.getUsername() != "INVALID_USER")
    {
	  // If the stored player is the client player
      if (existingPlayer.getUsername() == currentPlayer.getUsername())
      {
		// Then assign the current player to the stored player
        currentPlayer = existingPlayer;
        clientAmounts("main",currentPlayer.getUsername(), currentPlayer.getChips());
      }
	  // If not the current client then store it an list with its tableIndex
      currentPlayers[existingPlayer.getTableIndex()] = existingPlayer;
    }
  }

  var localIndex = currentPlayer.getTableIndex();
  var nextPlayerIndex;
  var nextPlayerIterator = 0;
  positions[currentPlayer.getUsername()] = "main";

  for (i = 0; i< maxPlayers - 1; i++)
  {
	// Increase the Iterator by one to indicate the next Player
    nextPlayerIterator++;
	// Provides the location of each connected client to the screen using
    nextPlayerIndex = (localIndex + nextPlayerIterator) % currentPlayers.length;
    var user = currentPlayers[nextPlayerIndex].getUsername();
	console.log(user);
	// If player is a connected user
    if ((user != "INVALID_USER") && (user != currentPlayer.getUsername()))
    {
	  // Draw that player location
	  console.log("This is the user: " + currentPlayers[nextPlayerIndex].getUsername());
      drawPlayerAt(nextPlayerIndex, i);
    }
  }

  // When called, number of players is increased
  numPlayers++;

}

// Occurs when all users except one folds
function lastAction() {
	action = 4;
	nextAction();
}

// Assigns the signal for which player's turn it is.
function assignSignal(data) {

	// Extracts the position for the current players turn
	var userTableIndex;
	for (var i = 0; i < currentPlayers.length; i++) {
		// The server keeps track of who's turn it is
		if ( currentPlayers[i].getUsername() == data.username ) {
			userTableIndex = currentPlayers[i].getTableIndex();
		}
	}

	// Deletes the current signal in the game
	var storeSignal;
	if (storeSignal = stage.getChildByName("signal")) {
		stage.removeChild(storeSignal);
	}


	var userSignal;
	var index;
	// Takes in the current client's position
	switch(localIndex) {
		case 0:
			userSignal = turn_signal(userTableIndex);
			break;
		case 1:
			index = (userTableIndex + 3 ) % maxPlayers;
			userSignal = turn_signal(index);
			break;
		case 2:
			index = (userTableIndex + 2 ) % maxPlayers;
			userSignal = turn_signal(index);
			break;
		case 3:
			index = (userTableIndex + 1 ) % maxPlayers;
			userSignal = turn_signal(index);
			break;
	}

	userSignal.name = "signal";
	stage.addChild(userSignal);
	stage.update();
}

// Passes cards to the indicated players
function passingCards() {
	localIndex = currentPlayer.getTableIndex();
	var nextPlayerIndex;
	var nextPlayerIterator = 0;

	// Extracts each player's position and passes the cards to them
	for(var i = 0; i < maxPlayers - 1; i++) {
		nextPlayerIterator++;
		nextPlayerIndex = (localIndex + nextPlayerIterator) % currentPlayers.length;
	    if (currentPlayers[nextPlayerIndex].getUsername() != "INVALID_USER")
	    {
			switch(i) {
				case 0:
					cardsToRight();
					break;
				case 1:
					cardsToBack();
					break;
				case 2:
					cardsToLeft();
					break;
			}
		}
	}
}


// Removes the left player from the current list of players
function onRemovePlayer(data) {
  var i;
  for (i = 0; i < currentPlayers.length; i++ )
  {
    if (currentPlayers[i].id == data.id)
    {
	  console.log("Someone left");
	  var username = currentPlayers[i].getUsername();
	  console.log("This user is: " + username);
	  /*if(username = game_menu.getChildByName(username)) {
	  	  game_menu.removeChild(username);
	  }*/
	  // get the position of the player and erase him from the stage
      //currentPlayers.splice(i, 1);
	  var position = positions[username];
	  console.log("This user is: " + username);
	  console.log("The position is: " + position);
	  var chip, card1, card2, action;
	  switch (position) {
	  	case "left":
			chip = game_menu.getChildByName("player3_chip_plate");
			card1 = stage.getChildByName("lCard1");
			card2 = stage.getChildByName("lCard2");
			action = stage.getChildByName("leftPlayerAction");
			break;
		  
	  	case "back":
			chip = game_menu.getChildByName("player4_chip_plate");
			card1 = stage.getChildByName("bCard1");
			card2 = stage.getChildByName("bCard2");
			action = stage.getChildByName("backPlayerAction");
			break;
		 
	  	case "right":
			chip = game_menu.getChildByName("player2_chip_plate");
			card1 = stage.getChildByName("rCard1");
			card2 = stage.getChildByName("rCard2");
			action = stage.getChildByName("rightPlayerAction");
			break;
	  }
	  game_menu.removeChild(chip);
	  stage.removeChild(card1, card2, action);
	  stage.update();
	  currentPlayers.splice(i, 1);
	  delete positions[username];
    }
  }
}


/* Draws other players on the board
   IndexAfterLocal refers the order they are in the array */
function drawPlayerAt(playerIndex, indexAfterLocal)
{
  if (indexAfterLocal == 0)
  {
    clientAmounts("left", currentPlayers[playerIndex].getUsername(), currentPlayers[playerIndex].getChips());
	positions[currentPlayers[playerIndex].getUsername()] = "right";
  }
  else if (indexAfterLocal == 1)
  {
    clientAmounts("back", currentPlayers[playerIndex].getUsername(), currentPlayers[playerIndex].getChips());
	positions[currentPlayers[playerIndex].getUsername()] = "back";
  }
  else if (indexAfterLocal == 2)
  {
    clientAmounts("right", currentPlayers[playerIndex].getUsername(), currentPlayers[playerIndex].getChips());
	positions[currentPlayers[playerIndex].getUsername()] = "left";
  }
}

// main menu to game
function menu() {

  // Title of Game
  title = new createjs.Text("Poker Room", "50px Bembo", "#FF0000");
  title.x = width/3.1;
  title.y = height/4;

  // Subtitle of Game
  subtitle = new createjs.Text("Let's Play Poker", "30px Bembo", "#FF0000");
  subtitle.x = width/2.8;
  subtitle.y = height/2.8;

  // Creating Buttons for Game
  addToMenu(title);
  addToMenu(subtitle);
  startButton();
  // update to show title and subtitle
  stage.update();
}

// Before all users presses ready
function lobby() {

   // This tells the server that the a new player has entered.
	 socket = io.connect();

	 socket.on('welcome', function (data) {
			console.log(data.message);

		 // New player message received by server
		 socket.on("new player", onNewPlayer);

		 // Player removed message received
		 socket.on("remove player", onRemovePlayer);

		 // Game is activated
		 socket.on("start game", start_game);

		 // Calls for the next action
		 socket.on("next action", nextAction);

		 // Adds buttons to the client
		 socket.on("add buttons", addButtonContainer);

		 // Deletes buttons from the client
		 socket.on("remove buttons", removeButtonContainer);

		 // Ready Button is shown to players
		 socket.on("ready", readyButton);

		 // Server indicates aditions to the pot
		 socket.on("add to pot", serverPot);

		 // Occurs when everyone has fold
		 socket.on("round over", lastAction);

		 // Indicates the winning player
		 socket.on("winning player", wonPlayer);

		 // Assigns the current turn signal
		 socket.on("signal", assignSignal);

		 // Assigns cards to the client
		 socket.on("client cards", assignCards)

		 socket.on("change amount", changeAmount);

		 socket.on("last bet", setLastUserBet);
		 
		 socket.on("player's action", playerAction);

		 socket.on("player's action", playerAction);

		 // Assigns cards to the table
		 socket.on("flop cards", flopCards)
		 socket.on("turn card", turnCard)
		 socket.on("river card", riverCard)
		 socket.on("other cards", otherCardsFunction);	// Server indicates the cards of the other players
		});

   // Setting all Events
   socket.emit("new player", {username: currentPlayer.getUsername(), chips: currentPlayer.getChips()});

   // All background for the lobby
   //pokerChip(490, 398);
   pokertable();
   paint_deck();
   optionsButton();
   helpButton();
   leaveButton(currentPlayer);
}

// Game is started when all players press ready
function start_game() {

  // Indicates to the server that the game is started
  socket.emit("first turn");
  // Passes the cards to the current client
  cardsToFront();
  // The pot is set to zero
  pot(0);
  // Passes card to the other players
  passingCards();
  // Cards are passed on the table
  tableCard();
}

// Creates the poker table and background
function pokertable() {
  // Retrieving the pokertable
  var table = new createjs.Bitmap("/images/pokertable.png");

  // Adjusting the location of the table
  table.x = width/6;
  table.y = height/3;

  // Adding the table and background to the game stage
  addToGame(table);
  createjs.Ticker.addEventListener("tick", handleTick);
  function handleTick(event) {
       stage.update();
  }

}

// Paints the deck on the table
function paint_deck() {
  var card_back = deck.card().get_card_back_object();
  card_back.x = 200;
  card_back.y = 300;
  addToGame(card_back);
}

// Passes table cards to the table
function tableCard() {
	var tCard1 = card1.get_card_back_object();
	tCard1.name = "tCard1";
	var tCard2 = card1.get_card_back_object();
	tCard2.name = "tCard2";
	var tCard3 = card1.get_card_back_object();
	tCard3.name = "tCard3";
	var tCard4 = card1.get_card_back_object();
	tCard4.name = "tCard4";
	var tCard5 = card1.get_card_back_object();
	tCard5.name = "tCard5";
	var cards = [tCard1,tCard2,tCard3,tCard4,tCard5];

	for (var i = 0; i < 5; i++) {
		cards[i].x = 200;
		cards[i].y = 300;
	}
	stage.addChild(tCard1,tCard2,tCard3,tCard4,tCard5);

	var i = 0;
	var j = 0;
	var limit = 6;
	// Access first card in the list
	var store = cards[0];
	var tableTicker = createjs.Ticker.addEventListener("tick", handleTick);
	// Iterate through each card in the list and move it to each positions
    function handleTick(event) {
		j++
    	store.x += limit;
        stage.update();
    	if (j > 50) {
			if (i == 4) {
				createjs.Ticker.off("tick",tableTicker);
// 				return;
			}
			j = 0;
			limit -= 1.2;
			i++;
    		store = cards[i];
      	}
    }
}

// Passes the first card to the player
function firstPass(card,x, y, card2, secondX, secondY, front) {

	var i = 0;
	var cardTicker = createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
    	 i++;
		 card.x += x;
		 card.y += y;
         stage.update();
    	 if (i > 50) {
			// if client
 			if (front == true) {
				flip(card,card1,310,504);
 			}
			// Calls the function to pass the second card
			secondPass(card2,secondX,secondY, front);
			createjs.Ticker.off("tick",cardTicker);
			return;
         }
    }
}

// Passes the second card to the player
function secondPass(card, x, y, front) {
	var i = 0;
	var cardTicker = createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
    	 i++;
		 card.x += x;
		 card.y += y;
         stage.update();
    	 if (i > 50) {
			// if client
  			if (front == true) {
 				flip(card,card2,375,504);
  			}
			createjs.Ticker.off("tick",cardTicker);
			return;
         }
    }
}

// Pass cards to client
function cardsToFront() {

	var pCard1 = deck.card().get_card_back_object();
	var pCard2 = deck.card().get_card_back_object();
    pCard1.x = 200;
    pCard1.y = 300;
    pCard2.x = 200;
    pCard2.y = 300;
	stage.addChild(pCard1,pCard2);

	// Passes them to the player
	firstPass(pCard1,2.2,4,pCard2,3.5,4, true);

}

// Pass cards to right player
function cardsToRight() {

	var rCard1 = deck.card().get_card_back_object();
	var rCard2 = deck.card().get_card_back_object();
    rCard1.x = 200;
    rCard1.y = 300;
    rCard2.x = 200;
    rCard2.y = 300;
	rCard1.name = "rCard1";
	rCard2.name = "rCard2";
    stage.addChild(rCard1,rCard2);

	// Passes them to the player
	firstPass(rCard1,-3.6,0,rCard2,-2.4,0,false);
}

// Pass cards to left player
function cardsToLeft() {

	var lCard1 = deck.card().get_card_back_object();
	var lCard2 = deck.card().get_card_back_object();
    lCard1.x = 200;
    lCard1.y = 300;
    lCard2.x = 200;
    lCard2.y = 300;
	lCard1.name = "lCard1";
	lCard2.name = "lCard2";
    stage.addChild(lCard1,lCard2);

	// Passes them to the player
	firstPass(lCard1,8.2,0,lCard2,9.4,0,false);
}

// Pass cards to back player
function cardsToBack() {

	var bCard1 = deck.card().get_card_back_object();
	var bCard2 = deck.card().get_card_back_object();
    bCard1.x = 200;
    bCard1.y = 300;
    bCard2.x = 200;
    bCard2.y = 300;
	bCard1.name = "bCard1";
	bCard2.name = "bCard2";
    stage.addChild(bCard1,bCard2);

	// Passes them to the player
	firstPass(bCard1,2.2,-4,bCard2,3.4,-4,false);
}

// Changes the amount of the pot
function pot(amount) {
	var pot;

	// Removes the current amount
	if (pot = stage.getChildByName("pot")) {
		stage.removeChild(pot);
	}

	pot_amount += amount;
	var pot_text = new createjs.Text("Pot: $" + pot_amount, "16px Bembo", "#FFFF00");
	pot_text.x = 260;
	pot_text.y = 390;
	pot_text.name = "pot";
	stage.addChild(pot_text);
	stage.update();
}

// When the server contacts, retrieve the amount
function serverPot(data) {
	lastBetAmount = data.amount;
	currentBetAmount = data.amount;
	pot(data.chips);
}

// This function will be called to accumulate the amount
// of money the player is betting.
function betAmount(amount) {

	// Will not go over current player amount
	if ((amount + amountBet) <= currentPlayer.getChips()) {

		// Erase the current bet amount
		var bet;
		if (bet = stage.getChildByName("bet_amount")) {
			stage.removeChild(bet);
		}

		// Creates the new amount
		amountBet += amount;
		var bet_amount = new createjs.Text("Bet: $" + amountBet, "16px Bembo", "#FFFF00");
		bet_amount.name = "bet_amount";
		bet_amount.x = 180;
		bet_amount.y = 445;
		stage.addChild(bet_amount);
		stage.update();
	}
}

// Provides the username and the user amount for each player
function clientAmounts(player, username, amount) {

  // Used by all users
  var chip_plate = new createjs.Container();
  var chip_plate_background = new createjs.Shape();
  var chip_background = new createjs.Shape();
  var user_amount = new createjs.Text(username + ": " + "$" + amount, "15px Bembo", "#FFFF00");

  // Takes the location of the player
  switch(player) {

		// main player details
  		case "main":
		    if (chip = game_menu.getChildByName("player1_chip_plate")) {
		  	  game_menu.removeChild(chip);
		    }
		    chip_plate_background.graphics.beginFill("black").drawRect(420,475,70,17);

		    chip_background.graphics.beginFill("red").drawCircle(430,483,15);
		    chip_background.graphics.beginFill("white").drawCircle(430,483,12);
		    chip_background.graphics.beginFill("red").drawCircle(430,483,9);
		    chip_background.graphics.beginFill("red").drawPolyStar(430,483,15,8,0.5,90);
		    chip_background.graphics.beginFill("white").drawCircle(430,483,2);

		    user_amount.x = 450;
		    user_amount.y = 476;
		    chip_plate.addChild(chip_plate_background, chip_background, user_amount);
		    chip_plate.name = "player1_chip_plate";
			break;

		// left player details
		case "left":
		    if (chip = game_menu.getChildByName("player2_chip_plate")) {
		  	  game_menu.removeChild(chip);
		    }
			chip_plate_background.graphics.beginFill("black").drawRect(30,380,88,17);

		    chip_background.graphics.beginFill("blue").drawCircle(20,390,15);
		    chip_background.graphics.beginFill("white").drawCircle(20,390,12);
		    chip_background.graphics.beginFill("blue").drawCircle(20,390,9);
		    chip_background.graphics.beginFill("blue").drawPolyStar(20,390,15,8,0.5,90);
		    chip_background.graphics.beginFill("white").drawCircle(20,390,2);

		    user_amount.x = 40;
		    user_amount.y = 380;
		    chip_plate.addChild(chip_plate_background,chip_background,user_amount);
		    chip_plate.name = "player2_chip_plate";
			break;

		// right player details
		case "right":
		    if (chip = game_menu.getChildByName("player3_chip_plate")) {
		  	  game_menu.removeChild(chip);
		    }
			chip_plate_background.graphics.beginFill("black").drawRect(625,380,88,17);

		    chip_background.graphics.beginFill("blue").drawCircle(615,390,15);
		    chip_background.graphics.beginFill("white").drawCircle(615,390,12);
		    chip_background.graphics.beginFill("blue").drawCircle(615,390,9);
		    chip_background.graphics.beginFill("blue").drawPolyStar(615,390,15,8,0.5,90);
		    chip_background.graphics.beginFill("white").drawCircle(615,390,2);

		    user_amount.x = 635;
		    user_amount.y = 380;
			chip_plate.addChild(chip_plate_background,chip_background,user_amount);
			chip_plate.name = "player3_chip_plate";
			break;

		// back user details
		case "back":
		    if (chip = game_menu.getChildByName("player4_chip_plate")) {
		  	  game_menu.removeChild(chip);
		    }
			chip_plate_background.graphics.beginFill("black").drawRect(326,175,88,17);

		    chip_background.graphics.beginFill("blue").drawCircle(316,187,15);
		    chip_background.graphics.beginFill("white").drawCircle(431,187,12);
		    chip_background.graphics.beginFill("blue").drawCircle(316,187,9);
		    chip_background.graphics.beginFill("blue").drawPolyStar(316,187,15,8,0.5,90);
		    chip_background.graphics.beginFill("white").drawCircle(316,187,2);

		    user_amount.x = 335;
		    user_amount.y = 175;
		    chip_plate.addChild(chip_plate_background,chip_background,user_amount);
		    chip_plate.name = "player4_chip_plate";
			break;
  }

  addToGame(chip_plate);
  stage.update();
}

function changeAmount(data) {

	var userTableIndex;
	for (var i = 0; i < currentPlayers.length; i++) {
		if ( currentPlayers[i].getUsername() == data.username ) {
			//retrieve the user's index on the table
			userTableIndex = currentPlayers[i].getTableIndex();
			console.log("This is the player's amount: " + currentPlayers[i].getChips());
			console.log("This is the chips that was passed in: " + data.chips);
			var amount = data.chips - currentPlayers[i].getChips();
			if (amount => 0) {
				currentPlayers[i].addChips(amount);
			}
			else {
				currentPlayers[i].deleteChips(amount);
			}
			console.log("This is the added amount: " + amount);
		}
	}

	var index;
	switch(localIndex) {
		case 0:
			index = userTableIndex;
			break;
		case 1:
			index = (userTableIndex + 3 ) % maxPlayers;
			break;
		case 2:
			index = (userTableIndex + 2 ) % maxPlayers;
			break;
		case 3:
			index = (userTableIndex + 1 ) % maxPlayers;
			break;
	}

	switch(index) {
		case 0:
			clientAmounts("main", data.username, data.chips);
			break;
		case 1:
			clientAmounts("left", data.username, data.chips);
			break;
		case 2:
			clientAmounts("back", data.username, data.chips);
			break;
		case 3:
			clientAmounts("right", data.username, data.chips);
			break;
	}

}

function newTurn() {
	currentBetAmount = 0;
	currentUserBet = 0;
	lastUserBet = 0;
	setAmountBet(0);
	
	var actionList = ["mainPlayerAction","leftPlayerAction","rightPlayerAction","backPlayerAction"];
	var store;
	for(var i = 0; i < actionList.length; i++) {
		if (store = stage.getChildByName(actionList[i])) {
			stage.removeChild(store);
		}
	}
}

// Once all user have finish their turn, go to the next action
function nextAction() {

	switch(action) {
		// Flips the first three cards on the table
		case 0:
			//pot(currentBetAmount);
			newTurn();
			var tCard5 = stage.getChildByName("tCard5");
			var tCard4 = stage.getChildByName("tCard4");
			var tCard3 = stage.getChildByName("tCard3");
			flip(tCard5,tableCard5,260,300);
			flip(tCard4,tableCard4,320,300);
			flip(tCard3,tableCard3,380,300);
			action++;
			break;
		// Flips the fourth card on the table
		case 1:
			//pot(currentBetAmount);
			newTurn();
			var tCard2 = stage.getChildByName("tCard2");
			flip(tCard2,tableCard2,440,300);
			action++;
			break;
		// Flips the fifth card on the table
		case 2:
			//pot(currentBetAmount);
			newTurn();
			var tCard1 = stage.getChildByName("tCard1");
			flip(tCard1,tableCard1,500,300);
			action++;
			break;
		// Flips all player's cards and allows players to play again
		case 3:
			//pot(currentBetAmount);
			newTurn();
			var cardList = ["rCard1","rCard2","lCard1","lCard2","bCard1","bCard2"];
			var placement = [20,300,80,300,615,300,675,300,310,90,370,90];
			var j = 0;

			for (var username in positions)
			{
				var card1, card2;
				if (positions[username] == "right")
				{
					card1 = stage.getChildByName("rCard1");
					card2 = stage.getChildByName("rCard2");

					var tempOtherCards = [];
					for (i = 0; i < otherCards.length; i++)
					{
						if (otherCards[i].get_owner() == username)
						{
							tempOtherCards.push(otherCards[i]);
						}
					}
					flip(card1, tempOtherCards[0], 20, 300);
					flip(card2, tempOtherCards[1], 80, 300);
				}
				if (positions[username] == "left")
				{
					card1 = stage.getChildByName("lCard1");
					card2 = stage.getChildByName("lCard2");

					var tempOtherCards = [];
					for (i = 0; i < otherCards.length; i++)
					{
						if (otherCards[i].get_owner() == username)
						{
							tempOtherCards.push(otherCards[i]);
						}
					}
					flip(card1, tempOtherCards[0], 615, 300);
					flip(card2, tempOtherCards[1], 675, 300);
				}
				if (positions[username] == "back")
				{
					card1 = stage.getChildByName("bCard1");
					card2 = stage.getChildByName("bCard2");

					var tempOtherCards = [];
					for (i = 0; i < otherCards.length; i++)
					{
						if (otherCards[i].get_owner() == username)
						{
							tempOtherCards.push(otherCards[i]);
						}
					}
					flip(card1, tempOtherCards[0], 310, 90);
					flip(card2, tempOtherCards[1], 370, 90);
				}
			}
			
			var display;

			otherCards = [];
			againButton();
			socket.emit("buttons",{remove: true});
			socket.emit("restart");
			action = 0;
			break;
		// All other players fold besides one player, then erase everything
		case 4:
			//pot(currentBetAmount);
			newTurn();
			var store;
			// Erases all unfolded cards
			var cardList = ["rCard1","rCard2","lCard1","lCard2","bCard1","bCard2",
							"tCard1","tCard2","tCard3","tCard4","tCard5"];
			for (var j = 0; j < cardList.length; j++) {
				if(store = stage.getChildByName(cardList[j])) {
					stage.removeChild(store);
				}
			}

			// Signal doesn't delete properly
			var signal = stage.getChildByName("signal");
			game_menu.removeChild(signal);

			// Erases all flip cards
			for (var i = 0; i < 13; i ++) {
				var shape = stage.getChildByName("tableCards");
				stage.removeChild(shape);
			}

			otherCards = [];
			againButton();
			socket.emit("buttons",{remove: true});
			socket.emit("restart");
			action = 0;
			break;
	}
}

// Flips any cards pass into this function
// x and y corresponds to where the new card should be placed
function flip(card,cardObj,x,y) {
	var i = 0;
	var store = card;
	var flipTick = createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
   	 	i++;
   	 	store.scaleX -= 0.05;
   	 	store.x += 1.2;
        stage.update();
   	 	if (i > 20) {
			stage.removeChild(card);
			playerCards(cardObj,x,y);
 			createjs.Ticker.off("tick",flipTick);
   		}
    }
}

// What does passedFirstCard mean?
function playerCards(cardObj,x,y) {

	if (passedFirstCard == false)
	{
		card = cardObj.get_card_container_object(cardObj);
		card.x += x;
		card.y += y;
		card.name =  "tableCards";
		passedFirstCard = true;
	}
	else
	{
		card = cardObj.get_card_container_object(cardObj);
		card.x += x;
		card.y += y;
		card.name =  "tableCards";
		passedFirstCard = false;
	}

	stage.addChild(card);
	stage.update();
}

// Server contacts client to say that he folded
function playerOptions() {
	fold();
}

// Adds the players buttons
function addButtonContainer() {
	var user_buttons = new createjs.Container();
	user_buttons.name = "buttons";
	var user_raise = raiseButton();
	var user_call = callButton();
	var user_fold = foldButton();
	user_buttons.addChild(user_raise,user_call,user_fold);
	game_menu.addChild(user_buttons);
	stage.update();
}

// Removes the client's buttons
function removeButtonContainer() {
	var user_buttons = game_menu.getChildByName("buttons");
	game_menu.removeChild(user_buttons);
	stage.update();
}

// Shows the player that won the game
function wonPlayer(data) {
	 var display;
	 if (display = game_menu.getChildByName("won player")) {
	 	 stage.removeChild(display);
	 }
	 
	 var amount = 0;
	 for (var i = 0; i < currentPlayers.length; i++) {
		 if(currentPlayers[i].getUsername() == data.player) {
			amount = currentPlayers[i].getChips() + pot_amount;
		 }
	 }
	 
	 socket.emit("changed amount",{id: data.player, chips: amount});
	 setPotToZero();
	 
	 console.log("This is the pot amount: " + pot_amount);
	 var player = new createjs.Text(data.player + " Wins!", "20px Bembo","#FFFF00");
 	 player.x = 350;
 	 player.y = 385;
	 player.name = "won player";
	 game_menu.addChild(player);
	 stage.update();
}

function playerAction(data) {
	var position = positions[data.player];
	var storeText;
	
	if (position == "main") {
		if (data.amount) {
			var text = new createjs.Text("You " + data.action + ": " + data.amount, "15px Bembo", "#FFFF00");
			text.x -= 25;
		}
		else {
			var text = new createjs.Text("You " + data.action, "15px Bembo", "#FFFF00");
		}
	}
	else {
		if (data.amount) {
			var text = new createjs.Text(data.action + ": " + data.amount, "15px Bembo", "#FFFF00");
			text.x -= 25;
		}
		else {
			var text = new createjs.Text(data.action, "15px Bembo", "#FFFF00");
		}
	}
	
	switch(position) {
		case "main":
			if (storeText = stage.getChildByName("mainPlayerAction")) {
				stage.removeChild(storeText);
			}
			text.x += 210;
			text.y += 525;
			text.name = "mainPlayerAction";
			break;
		case "left":
			if (storeText = stage.getChildByName("leftPlayerAction")) {
				stage.removeChild(storeText);
			}
			text.x += 665;
			text.y += 410;
			text.name = "leftPlayerAction";
			break;
		case "right":
			if (storeText = stage.getChildByName("rightPlayerAction")) {
				stage.removeChild(storeText);
			}
			text.x += 75;
			text.y += 410;
			text.name = "rightPlayerAction";
			break;
		case "back":
			if (storeText = stage.getChildByName("backPlayerAction")) {
				stage.removeChild(storeText);
			}
			text.x += 450;
			text.y += 120;
			text.name = "backPlayerAction";
			break;
	}
	
	stage.addChild(text);
	stage.update();
}
/*
function displayWinner(data) {
	var display;
	// Removes the current amount
	if (display = stage.getChildByName("winner")) {
		stage.removeChild(display);
	}
    
	
	var winner = new createjs.Text(data.username + " Won!", "20px Bembo", "#FFFF00");
	winner.x = 350;
	winner.y = 385;
	winner.name = "winner";
	stage.addChild(winner);
	stage.update();
}
*/
//Countdown timer used to detect AFK players
/*
function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  
  return {
    'total': t,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

var deadline = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);
initializeClock('clockdiv', deadline);
*/
