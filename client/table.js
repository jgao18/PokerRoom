var stage, canvas;
var width, height;
var deck;
var socket;
var currentPlayer;
var currentPlayers;
var maxPlayers;
var numPlayers = 0;
var action = 0;
var amountBet = 0;
var currentBetAmount = 0;
var currentUserBet = 0;
var lastUserBet = 0;
var lastBetAmount = 0;
var pot_amount = 0;
var positions = {};
var zeroChipsList = [];

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
var timeTicker;

function getTotalBet(){
	return currentBetAmount;
}

function getLastBetAmount(){
	return lastBetAmount;
}

function setLastUserBet(data){
	lastUserBet = data.chips;
}

function getLastUserBet(){
	return lastUserBet;
}

function setPotToZero(){
	pot_amount = 0;
	pot(0);
}

function getAmountBet(){
	return amountBet;
}

function getCurrentPlayer(){
	return currentPlayer.getUsername();
}

function setAmountBet(num){
	amountBet = num;
}

function removePlayerChips(amount){
	currentPlayer.deleteChips(amount);
}

function getPlayerChips(){
	return currentPlayer.getChips();
}

// Adds object to Game Container
function addToGame(object){
	game_menu.addChild(object);
	stage.update();
}

function deleteItemFromGame(object){
	game_menu.removeChild(object);
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

	// Loading the background image and sounds
	backgroundFelt();
	stage.addChild(game_menu);

	// Get dimensions of Canvas
	canvas = document.getElementById('demoCanvas');
	width = canvas.width;
	height = canvas.height;

	// Fills the array with Players
	for (i = 0; i< maxPlayers; i++){
		currentPlayers.push(new Player());
	}
	
	// Changes the pace of the Tickers
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.setFPS(60);

	menu();
}

//Indicates what cards have been used
function otherCardsFunction(data){
	// Saves the array of cards from the server
	inputPlayerCards = data;
	temp = [];

	// Inserts new card objects by using the server information
	for (i = 0; i < inputPlayerCards.length; i++){
		temp.push(new Card(inputPlayerCards[i].value, inputPlayerCards[i].suit, inputPlayerCards[i].owner))
	}

	// Pushes all other cards from the temp list into a global list
	for (i = 0; i < temp.length; i++){
		if ( (temp[i].get_value() != card1.get_value()) || (temp[i].get_suit() != card1.get_suit())){
			if ( (temp[i].get_suit() != card2.get_suit()) || (temp[i].get_value() != card2.get_value())){
				otherCards.push(temp[i]);
			}
		}
	}

}

// produces the player cards
function assignCards(data){
	card1 = new Card(data.value1, data.suit1, data.owner);
	card2 = new Card(data.value2, data.suit2, data.owner);
}

function flopCards(data){
	tableCard5 = new Card(data.value1, data.suit1);
	tableCard4 = new Card(data.value2, data.suit2);
	tableCard3 = new Card(data.value3, data.suit3);
}

function turnCard(data){
	tableCard2 = new Card(data.value, data.suit);
}

function riverCard(data){
	tableCard1 = new Card(data.value, data.suit);
}

function onNewPlayer(data){

	var playerList = data;
	//var localIndex = currentPlayer.getTableIndex();
	var nextPlayerIndex;
	var nextPlayerIterator = 0;
	
	for (i = 0; i < playerList.length; i++){
		var existingPlayer = new Player(playerList[i].id, playerList[i].username, playerList[i].chips, playerList[i].index);
		if (existingPlayer.getId() != undefined){
			// If the stored player is the client player
			if (existingPlayer.getUsername() == currentPlayer.getUsername()){
				currentPlayer = existingPlayer;
				clientAmounts("main",currentPlayer.getUsername(), currentPlayer.getChips());
			}
			currentPlayers[existingPlayer.getTableIndex()] = existingPlayer;
		}
	}
	
	var localIndex = currentPlayer.getTableIndex();
	positions[currentPlayer.getUsername()] = "main";

	for (i = 0; i< maxPlayers - 1; i++){
		nextPlayerIterator++;
		// Provides the location of each connected client to the screen
		nextPlayerIndex = (localIndex + nextPlayerIterator) % currentPlayers.length;
		var user = currentPlayers[nextPlayerIndex];
		if ((user.getId() != undefined) && (user.getUsername() != currentPlayer.getUsername())){
			drawPlayerAt(nextPlayerIndex, i);
		}
	}
	
	numPlayers++;
}

// Occurs when all users except one folds
function lastAction(data) {
	if(data.status == "only one player"){
		action = 5;
	}
	else{
		action = 4;
	}
	nextAction();
}

// Assigns the signal for which player's turn it is.
function assignSignal(data) {
	var i;
	var userTableIndex;
	for (i = 0; i < currentPlayers.length; i++){
		if ( currentPlayers[i].getUsername() == data.username){
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
	var localIndex = currentPlayer.getTableIndex();
	// Takes in the current client's position
	switch(localIndex){
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
	for(var i = 0; i < maxPlayers; i++) {
		nextPlayerIterator++;
		nextPlayerIndex = (localIndex + nextPlayerIterator) % currentPlayers.length;
	    if ((currentPlayers[i].getId() != undefined) && (currentPlayers[i].getUsername() != currentPlayer))
	    {
			switch(positions[currentPlayers[i].getUsername()]) {
				case "right":
					cardsToRight();
					break;
				case "back":
					cardsToBack();
					break;
				case "left":
					cardsToLeft();
					break;
			}
		}
	}
}


// Removes a player from the current list of players
function onRemovePlayer(data) {
  var i;
  for (i = 0; i < currentPlayers.length; i++){
    if (currentPlayers[i].id == data.id){
	  	var username = currentPlayers[i].getUsername();
	  	var position = positions[username];
	  	var chip, card1, card2, action;
	 	 	switch (position){
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
	  	currentPlayers.push(new Player());
	  	delete positions[username];
   	}
  }
}


/* Draws other players on the board
   IndexAfterLocal refers the order they are in the array */
function drawPlayerAt(playerIndex, indexAfterLocal){
  if (indexAfterLocal == 0){
  	clientAmounts("left", currentPlayers[playerIndex].getUsername(), currentPlayers[playerIndex].getChips());
		positions[currentPlayers[playerIndex].getUsername()] = "right";
  }
  else if (indexAfterLocal == 1){
    clientAmounts("back", currentPlayers[playerIndex].getUsername(), currentPlayers[playerIndex].getChips());
		positions[currentPlayers[playerIndex].getUsername()] = "back";
  }
  else if (indexAfterLocal == 2){
  	clientAmounts("right", currentPlayers[playerIndex].getUsername(), currentPlayers[playerIndex].getChips());
		positions[currentPlayers[playerIndex].getUsername()] = "left";
  }
}

// main menu to game
function menu() {
  lobby();
}

function lobby() {

	// This tells the server that the a new player has entered.
	socket = io.connect();
	socket.on('welcome', function (data) {

		// Assigns the information for the client
		var tempUsername = data.message.toString().split(" ")[0];
		var tempChipAmount = data.message.toString().split(" ")[1];

		currentPlayer = new Player();
		currentPlayer.setUsername(tempUsername);
		currentPlayer.addChips(tempChipAmount);

		// Setting all Events
		socket.emit("new player", {username: currentPlayer.getUsername(), chips: currentPlayer.getChips()});
		socket.on("new player", onNewPlayer);
		socket.on("remove player", onRemovePlayer);
		socket.on("start game", start_game);
		socket.on("next action", nextAction);
		socket.on("add buttons", addButtonContainer);
		socket.on("remove buttons", removeButtonContainer);
		socket.on("ready", readyButton);
		socket.on("add to pot", serverPot);
		socket.on("round over", lastAction);
		socket.on("winning player", wonPlayer);
		socket.on("signal", assignSignal);
		socket.on("client cards", assignCards)
		socket.on("change amount", changeAmount);
		socket.on("last bet", setLastUserBet);
		socket.on("player's action", playerAction);
		socket.on("again button", againButton);
		socket.on("timer", timer);

		// Assigns cards to the table
		socket.on("flop cards", flopCards)
		socket.on("turn card", turnCard)
		socket.on("river card", riverCard)
		socket.on("other cards", otherCardsFunction);	
	});

	pokertable();
	paint_deck();
	soundButton();
//	optionsButton();
	helpButton();
	leaveButton(currentPlayer);
}

function showAgain(){
	againButton();
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

	for (var i = 0; i < 5; i++){
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
  function handleTick(event){
		j++
    store.x += limit;
    stage.update();
    if (j > 50){
	  	if (i == 4){
				createjs.Ticker.off("tick",tableTicker);
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
  function handleTick(event){
    i++;
		card.x += x;
		card.y += y;
    stage.update();
    if (i > 50){
 			if (front == true){
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
function secondPass(card, x, y, front){
	var i = 0;
	var cardTicker = createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
   	  i++;
		  card.x += x;
		  card.y += y;
      stage.update();
    	if (i > 50) {
  			if (front == true){
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

	firstPass(bCard1,2.2,-4,bCard2,3.4,-4,false);
}

// Changes the amount of the pot
function pot(amount){
	var pot;

	// Removes the current amount
	if (pot = stage.getChildByName("pot")){
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
function serverPot(data){
	lastBetAmount = data.amount;
	currentBetAmount = data.amount;
	pot(data.chips);
}

// Provides the username and the user amount for each player
function clientAmounts(player, username, amount){

  // Used by all users
  var chip_plate = new createjs.Container();
  var chip_plate_background = new createjs.Shape();
  var chip_background = new createjs.Shape();
  var user_amount = new createjs.Text(username + ": " + "$" + amount, "15px Bembo", "#FFFF00");

  // Takes the location of the player
  switch(player){

  	// main player details
  	case "main":
    	if (chip = game_menu.getChildByName("player1_chip_plate")){
	    	game_menu.removeChild(chip);
      }
      chip_plate_background.graphics.beginFill("black").drawRect(330,601,130,17);

      chip_background.graphics.beginFill("red").drawCircle(320,610,15);
      chip_background.graphics.beginFill("white").drawCircle(320,610,12);
      chip_background.graphics.beginFill("red").drawCircle(320,610,9);
      chip_background.graphics.beginFill("red").drawPolyStar(320,610,15,8,0.5,90);
      chip_background.graphics.beginFill("white").drawCircle(320,610,2);

      user_amount.x = 338;
      user_amount.y = 601;
      chip_plate.addChild(chip_plate_background, chip_background, user_amount);
      chip_plate.name = "player1_chip_plate";
	 	 break;

    // left player details
 	 case "left":
      if (chip = game_menu.getChildByName("player2_chip_plate")){
	    	game_menu.removeChild(chip);
      }
	  	chip_plate_background.graphics.beginFill("black").drawRect(30,380,130,17);

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
      if (chip = game_menu.getChildByName("player3_chip_plate")){
	    	game_menu.removeChild(chip);
      }
		  chip_plate_background.graphics.beginFill("black").drawRect(617,380,130,17);

      chip_background.graphics.beginFill("blue").drawCircle(605,390,15);
      chip_background.graphics.beginFill("white").drawCircle(605,390,12);
      chip_background.graphics.beginFill("blue").drawCircle(605,390,9);
      chip_background.graphics.beginFill("blue").drawPolyStar(605,390,15,8,0.5,90);
      chip_background.graphics.beginFill("white").drawCircle(605,390,2);

      user_amount.x = 622;
      user_amount.y = 380;
		  chip_plate.addChild(chip_plate_background,chip_background,user_amount);
		  chip_plate.name = "player3_chip_plate";
		  break;

 	  // back user details
 	 case "back":
      if (chip = game_menu.getChildByName("player4_chip_plate")){
	   		game_menu.removeChild(chip);
      }
	  	chip_plate_background.graphics.beginFill("black").drawRect(326,178,130,17);

      chip_background.graphics.beginFill("blue").drawCircle(316,187,15);
      chip_background.graphics.beginFill("white").drawCircle(316,187,12);
      chip_background.graphics.beginFill("blue").drawCircle(316,187,9);
      chip_background.graphics.beginFill("blue").drawPolyStar(316,187,15,8,0.5,90);
      chip_background.graphics.beginFill("white").drawCircle(316,187,2);

      user_amount.x = 335;
      user_amount.y = 178;
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
      userTableIndex = currentPlayers[i].getTableIndex();
      var amount = data.chips - currentPlayers[i].getChips();
			currentPlayers[i].addChips(amount);
    }
  }

  var index;
  var localIndex = currentPlayer.getTableIndex();
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
	lastBetAmount = 0;
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
			newTurn();
			var tCard2 = stage.getChildByName("tCard2");
			flip(tCard2,tableCard2,440,300);
			action++;
			break;
			
		// Flips the fifth card on the table
		case 2:
			newTurn();
			var tCard1 = stage.getChildByName("tCard1");
			flip(tCard1,tableCard1,500,300);
			action++;
			break;
			
		// Flips all player's cards and allows players to play again
		case 3:
			newTurn();
			var cardList = ["rCard1","rCard2","lCard1","lCard2","bCard1","bCard2"];
			var placement = [20,300,80,300,615,300,675,300,310,90,370,90];
			var i = 0;
			var j = 0;

			for (var username in positions)
			{
				var card1, card2;
				var tempOtherCards = [];

				if (positions[username] == "right"){
					card1 = stage.getChildByName("rCard1");
					card2 = stage.getChildByName("rCard2");

					for (i = 0; i < otherCards.length; i++){
						if (otherCards[i].get_owner() == username){
							tempOtherCards.push(otherCards[i]);
						}
					}
					
					if (tempOtherCards[0] != null){
						flip(card1, tempOtherCards[0], 20, 300);
						flip(card2, tempOtherCards[1], 80, 300);
				    }
				}
				if (positions[username] == "left"){
					card1 = stage.getChildByName("lCard1");
					card2 = stage.getChildByName("lCard2");

					for (i = 0; i < otherCards.length; i++){
						if (otherCards[i].get_owner() == username){
							tempOtherCards.push(otherCards[i]);
						}
					}
					
					if (tempOtherCards[0] != null){
					  flip(card1, tempOtherCards[0], 615, 300);
					  flip(card2, tempOtherCards[1], 675, 300);
				    }
				}
				if (positions[username] == "back"){
					card1 = stage.getChildByName("bCard1");
					card2 = stage.getChildByName("bCard2");

					for (i = 0; i < otherCards.length; i++)
					{
						if (otherCards[i].get_owner() == username)
						{
							tempOtherCards.push(otherCards[i]);
						}
					}
					if (tempOtherCards[0] != null){
						flip(card1, tempOtherCards[0], 310, 90);
						flip(card2, tempOtherCards[1], 370, 90);
				    }
				}
			}

			otherCards = [];
			againButton();
			socket.emit("buttons",{remove: true});
			socket.emit("restart");
			action = 0;
			break;
			
		// All other players fold besides one player, then erase everything
		case 4:
			
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
			var storeSignal;
			if (storeSignal = stage.getChildByName("signal")) {
				stage.removeChild(storeSignal);
			}

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
			
		case 5:
			
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
			var storeSignal;
			if (storeSignal = stage.getChildByName("signal")) {
				stage.removeChild(storeSignal);
			}
			
			var again = stage.getChildByName("againButton");
			game_menu.removeChild(again);
			
			var ready = game_menu.getChildByName("readyButton");
			game_menu.removeChild(ready);

			// Erases all flip cards
			for (var i = 0; i < 13; i ++) {
				var shape = stage.getChildByName("tableCards");
				stage.removeChild(shape);
			}
			
			otherCards = [];
			socket.emit("buttons",{remove: true});
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

	if (passedFirstCard == false){
		card = cardObj.get_card_container_object(cardObj);
		card.x += x;
		card.y += y;
		card.name =  "tableCards";
		passedFirstCard = true;
	}
	else{
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

function removeCallandFoldButton(){
	var buttonContainer = game_menu.getChildByName("buttons");
	var call_button = buttonContainer.getChildByName("call_button");
	var fold_button = buttonContainer.getChildByName("fold_button");
	var storeSignal;
	if (storeSignal = stage.getChildByName("signal")) {
		stage.removeChild(storeSignal);
	}
	buttonContainer.removeChild(call_button,fold_button);
}

function addCallandFoldButton() {
	var buttonContainer = game_menu.getChildByName("buttons");
	var user_call = callButton();
	var user_fold = foldButton();
	user_call.name = "call_button";
	user_fold.name = "fold_button";
	buttonContainer.addChild(user_call,user_fold);
	stage.update();
}

// Adds the players buttons
function addButtonContainer() {
	var user_buttons = new createjs.Container();
	user_buttons.name = "buttons";
	var user_raise = raiseButton(currentPlayer.getChips());
	var user_call = callButton();
	var user_fold = foldButton();
	user_call.name = "call_button";
	user_fold.name = "fold_button";
	user_buttons.addChild(user_fold);
	if (zeroChipsList.indexOf(currentPlayer.getUsername()) < 0) {
		user_buttons.addChild(user_raise,user_call)
	}
	game_menu.addChild(user_buttons);
	stage.update();
}

// Removes the client's buttons
function removeButtonContainer() {
	// remove timer
	createjs.Ticker.off("tick",timeTicker);
	var timer = stage.getChildByName("time");
	stage.removeChild(timer);
	// remove buttons
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
		 else if (currentPlayers[i].getChips()*1 == 0 && currentPlayers[i].getUsername() != "INVALID_USER") {
			 zeroChipsList.push(currentPlayers[i].getUsername());
		 }
	 }
	 socket.emit("changed amount",{id: data.player, chips: amount});
	 setPotToZero();

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
			text.x += 160;
			text.y += 525;
			text.name = "mainPlayerAction";
			break;
		case "left":
			if (storeText = stage.getChildByName("leftPlayerAction")) {
				stage.removeChild(storeText);
			}
			text.x += 645;
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
			text.x += 460;
			text.y += 120;
			text.name = "backPlayerAction";
			break;
	}

	stage.addChild(text);
	stage.update();
}

function timer(data){
	var past = new Date();
	var i = 30;
	var store;
	var timeText = new createjs.Text(i, "20px Bembo", "red");
 	timeText.x = 360;
	timeText.y = 390;
	timeText.name = "time";
	stage.addChild(timeText);
    stage.update();

	timeTicker = createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
		 var d = new Date();
		 var dSeconds = d.getSeconds();
		 var pastSeconds = past.getSeconds();
    	 if (dSeconds > pastSeconds || (dSeconds == 0) && (pastSeconds == 59)) {
			 past = d;
			 i--;
			 timeText.text = i;
			 stage.update();
			 if (i < 1) {
			 	createjs.Ticker.off("tick",timeTicker);
			    store = game_menu.getChildByName("raise_container");
				game_menu.removeChild(store);
				var player = getCurrentPlayer();
				socket.emit("buttons", {remove: false, action: "fold"});
				socket.emit("fold",{username: player});
				socket.emit("current turn",{action: "fold", user: player});
			 }
         }
    }
}
