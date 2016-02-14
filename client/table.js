var stage, circle, text;
var canvas, context, buttonNames;
var width, height;
var bg, main;
var main_backgroud;
var deck;
var socket;
var currentPlayer;
var currentPlayers;
var maxPlayers;
var playerIndex;
var numPlayers = 0;
var tableCardsPass = false;
var numOfTimes = 0;
var playerIterator = 0;
var action = 0;

// Holds all items for the game
var game_menu = new createjs.Container();

function randomUserStart() {
	return Math.floor(Math.random()* numPlayers);
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

// Removes all items from Game Container
function removeGameChildren() {
	game_menu.removeAllChildren();
	stage.update();
}

function childFinder(object) {
	for (var i = 0; i < stage.numChildren; i++ ) {
		console.log(stage.getChildAt(i).name);
		if (stage.getChildAt(i).name == object) {
			return stage.getChildAt(i);
		}
	}
}

function game_init() {
  // Creating the stage
  stage = new createjs.Stage("demoCanvas");
  // Loading the background image
  backgroundFelt();
  stage.addChild(game_menu);

  // Get dimensions of Canvas
  canvas = document.getElementById('demoCanvas');

  width = canvas.width;
  height = canvas.height;

  deck = new Deck();
  deck.get_new_deck();

  currentPlayers = [];
  maxPlayers = 4
  for (i = 0; i< maxPlayers; i++)
  {
    currentPlayers.push(new Player());
  }
  
  currentPlayer = new Player();
  currentPlayer.setUsername("testUser" + Math.floor((Math.random() * 100) + 1));
  currentPlayer.setPassword("testPassword" + Math.floor((Math.random() * 10) + 1));
  currentPlayer.addChips(Math.floor((Math.random() * 10000) + 1));
  //socket.emit("new player", {username: currentPlayer.getUsername(), chips: currentPlayer.getChips()});

  menu();
}

var setEventHandlers = function() {
	// Socket connection successful
  	socket.on("connect", onSocketConnected);

	// Socket disconnection
	//socket.on("disconnect", onSocketDisconnect);

	// New player message received by server
	socket.on("new player", onNewPlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);
	
	// Game is activated
	socket.on("start game", start_game);
	
	// The server sending information to the client on who turn it is
	socket.on("current turn", playerTurn);
	
	// Calls for the next action
	socket.on("next action", nextAction);
};

function onSocketConnected() {
  console.log("Client connected!");
}

// Gets called when new player joins.
function onNewPlayer(data)
{
  playerList = data;

  console.log(data[0].id);
  
  for (i = 0; i < playerList.length; i++)
  {
    var existingPlayer = new Player(playerList[i].id, playerList[i].username, playerList[i].chips, playerList[i].index);
    if (existingPlayer.getUsername() != "INVALID_USER")
    {
      if (existingPlayer.getUsername() == currentPlayer.getUsername())
      {
        currentPlayer = existingPlayer;
        playerAmount(currentPlayer.getUsername(), currentPlayer.getChips());
        console.log("Found the current player. His username is " + currentPlayer.getUsername() + " and his tableIndex is " + currentPlayer.getTableIndex());
      }
      currentPlayers[existingPlayer.getTableIndex()] = existingPlayer;
    }
  }

  console.log(currentPlayers);

  var localIndex;
  
  localIndex = currentPlayer.getTableIndex();
  console.log("The player tableIndex is: " + currentPlayer.getTableIndex());
  var nextPlayerIndex;
  var nextPlayerIterator = 0;

  for (i = 0; i< maxPlayers - 1; i++)
  {
	// Increase the Iterator by one to indicate the next Player
    nextPlayerIterator++;
	// modulo with the current length of players
    nextPlayerIndex = (localIndex + nextPlayerIterator) % currentPlayers.length;
	console.log("The nextPlayerIndex is: " + nextPlayerIndex);
    //console.log(currentPlayers)
    //console.log(currentPlayers[nextPlayerIndex].getUsername() != "INVALID_USER");
    if (currentPlayers[nextPlayerIndex].getUsername() != "INVALID_USER")
    {
      console.log("got thru" + nextPlayerIndex + " fdsfds" + i);
      drawPlayerAt(nextPlayerIndex, i);
    }
  }
  
  numPlayers++;
}

function playerTurn(data) {
	console.log(data);
	var userTurn = data.username;
	console.log("Indicating the player's turn right now " + userTurn);
	
	if (numOfTimes > 0) {
		console.log("Hello my name is Jessie!");
		var shape = game_menu.getChildByName("signal");
		game_menu.removeChild(shape);
	}
	
	numOfTimes++;
	
    var nextPlayerIndex;
	localIndex = currentPlayer.getTableIndex();
	playerIterator++;
	nextPlayerIndex = (localIndex + playerIterator) % numPlayers;
	
	for (var i = 0; i < currentPlayers.length; i++) {
		console.log("This is the localIndex: " + localIndex);
		console.log("This is the playerIterator: " + playerIterator);
		console.log("This is the numPlayers: " + numPlayers)
		console.log(nextPlayerIndex);
		if (currentPlayers[i].getUsername() == userTurn) {
			var signal = turn_signal(nextPlayerIndex);
			addToGame(signal);
			stage.update();
		}
	}
}

function nextAction() {
	switch(action) {
		case 0:
			var tCard5 = stage.getChildByName("tCard5");
			var tCard4 = stage.getChildByName("tCard4");
			var tCard3 = stage.getChildByName("tCard3");
			flip(tCard5,260,300);
			flip(tCard4,320,300);
			flip(tCard3,380,300);
			action++;
			break;
			//flip three cards
		case 1:
			var tCard2 = stage.getChildByName("tCard2");
			flip(tCard2,440,300);
			action++;
			break;
			//flip next card
		case 2:
			var tCard1 = stage.getChildByName("tCard1");
			flip(tCard1,500,300);
			action++;
			break;
			//flip last card
		case 3:
			var cardList = ["rCard1","rCard2","lCard1","lCard2","bCard1","bCard2"];
			var placement = [20,300,80,300,615,300,675,300];
			var j = 0;
			for (var i = 0; i < cardList.length; i++) {
				if (stage.getChildByName(cardList[i]) != null) {
					var card1 = stage.getChildByName(cardList[i]);
					var card2 = stage.getChildByName(cardList[i+1]);
					flip(card1,placement[j],placement[j+1]);
					flip(card2,placement[j+2],placement[j+3]);
				}
				j += 4;
				i++;
			}
			action++;
			break;
		case 4:
			//action = 0;
			
			for (var i = 0; i < 13; i ++) {
				var shape = stage.getChildByName("tableCards");
				stage.removeChild(shape);
			}
			var cardList = ["rCard1","rCard2","lCard1","lCard2","bCard1","bCard2"];
			/*for(var j = 0; i < cardList.length; i += ) {
				
			}*/
			//show all cards 
			//turn action to 0;
	}
}


function passingCards() {
	
    if( tableCardsPass == false ) {
    	 tableCard();
  	     tableCardsPass == true;
    }
		
	localIndex = currentPlayer.getTableIndex();
	var nextPlayerIndex;
	var nextPlayerIterator = 0;
	console.log("Printing in the passing Cards Function");
	
	for(var i = 0; i < maxPlayers - 1; i++) {
		nextPlayerIterator++;
		nextPlayerIndex = (localIndex + nextPlayerIterator) % currentPlayers.length;
	    if (currentPlayers[nextPlayerIndex].getUsername() != "INVALID_USER")
	    {
			console.log("Printing in the passing cards section");
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

// Doesn't work properly
function onRemovePlayer(data) {
  var i;
  for (i = 0; i < currentPlayers.length; i++ )
  {
    if (currentPlayers[i].id == data.id)
    {
      currentPlayers.splice(i, 1);
      return;
    }
  }
}

// Draws other players on the board
// IndexAfterLocal refers the order they are in the array
function drawPlayerAt(playerIndex, indexAfterLocal)
{ 
  if (indexAfterLocal == 0)
  {
    leftUserAmount(currentPlayers[playerIndex].getUsername(), currentPlayers[playerIndex].getChips());
  }
  else if (indexAfterLocal == 1)
  {
    backUserAmount(currentPlayers[playerIndex].getUsername(), currentPlayers[playerIndex].getChips());
  }
  else if (indexAfterLocal == 2)
  {
    rightUserAmount(currentPlayers[playerIndex].getUsername(), currentPlayers[playerIndex].getChips());
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
  howToPlayButton();

  // update to show title and subtitle
  stage.update();
}

function lobby() {
	
   // This tells the server that the a new player has entered.
   socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
   setEventHandlers();
   socket.emit("new player", {username: currentPlayer.getUsername(), chips: currentPlayer.getChips()});
   
   // All the prepared background for lobby
   pokertable();
   paint_deck();
   readyButton();
   optionsButton();
   leaveButton(currentPlayer);
}

// Starts game
function start_game() {

  // This should be filled by the database in a future implementaton
  // This tells the server that the a new player has entered.
  //socket.emit("new player", {username: currentPlayer.getUsername(), chips: currentPlayer.getChips()});

  //document.getElementById("demoCanvas").style.background = '#FF0000';
  socket.emit("current turn");
  passFirstCard();
  callButton();
  raiseButton();
  passingCards()
  //chip();
  foldButton();
}

// Creates the poker table and background
function pokertable() {
  // Retrieving the pokertable
  var table = new createjs.Bitmap("../images/pokertable.png");

  // adjusting the location of the table
  table.x = width/6;
  table.y = height/3;
  // adding the table and background to container and stage
  addToGame(table);
  createjs.Ticker.addEventListener("tick", handleTick);
  function handleTick(event) {
       stage.update();
  }
}

function paint_deck() {

  var card_back = deck.card().get_card_back_object();
  card_back.x = 200;
  card_back.y = 300;
  addToGame(card_back);
}

// Still needs work
function tableCard() {
	var tCard1 = deck.card().get_card_back_object();
	tCard1.name = "tCard1";
	var tCard2 = deck.card().get_card_back_object();
	tCard2.name = "tCard2";
	var tCard3 = deck.card().get_card_back_object();
	tCard3.name = "tCard3";
	var tCard4 = deck.card().get_card_back_object();
	tCard4.name = "tCard4";
	var tCard5 = deck.card().get_card_back_object();
	tCard5.name = "tCard5";
	var cards = [tCard1,tCard2,tCard3,tCard4,tCard5];

	var i;
	for (i = 0; i < 5; i++) {
		cards[i].x = 200;
		cards[i].y = 300;
	}

	stage.addChild(tCard1,tCard2,tCard3,tCard4,tCard5);
	// So I could put this is an array then access one at a time
	i = 0;
	var j = 0;
	var limit = 6;
	var store = cards[0];
	var tableTicker = createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
		if (i > 4) {
			createjs.Ticker.off("tick",tableTicker);
			return;
		}
		j++
    	store.x += limit;
        stage.update();
    	if (j > 50) {
			j = 0;
			limit -= 1.2;
			i++;
    		store = cards[i];
      	}
    }
}

function passFirstCard() {
  var pCard1 = deck.card().get_card_back_object();
  pCard1.x = 200;
  pCard1.y = 300;
  stage.addChild(pCard1);

  var i = 0;
  var tick1 = createjs.Ticker.addEventListener("tick", handleTick);
  function handleTick(event) {
  	 i++;
  	 pCard1.x += 2.2;
  	 pCard1.y += 4;
     stage.update();
  	 if (i > 50) {
  		createjs.Ticker.off("tick",tick1);
		flip(pCard1,310,504);
  		passSecondCard();
    }
  }
}

function passSecondCard() {
  var pCard2 = deck.card().get_card_back_object();
  pCard2.x = 200;
  pCard2.y = 300;
  stage.addChild(pCard2);

	var i = 0;
    var tick2 = createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
		 i++;
		 pCard2.x += 3.5;
		 pCard2.y += 4;
         stage.update();
		 if (i > 50) {
			createjs.Ticker.off("tick",tick2);
			flip(pCard2,375,504);
		 }
    }
}

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

    var i = 0;
    var rightTicker1 = createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
    	 i++;
    	 rCard1.x -= 3.6;
         stage.update();
    	 if (i > 50) {
			createjs.Ticker.off("tick",rightTicker1);
			nextRightCard();
      }
    }

	function nextRightCard() {
    	var j = 0;
    	var rightTicker2 = createjs.Ticker.addEventListener("tick", handleTick);
    	function handleTick(event) {
    	 	j++;
    	 	rCard2.x -= 2.4;
         	stage.update();
    	 	if (j > 50) {
    			createjs.Ticker.off("tick",rightTicker2);
     	    }
	    }
    }
}

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

    var i = 0;
    var leftTicker1 = createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
    	 i++;
    	 lCard1.x += 8.2;
         stage.update();
    	 if (i > 50) {
    		createjs.Ticker.off("tick",leftTicker1);
			nextLeftCard();
      }
    }

	function nextLeftCard() {
    	var j = 0;
    	var leftTicker2 = createjs.Ticker.addEventListener("tick", handleTick);
    	function handleTick(event) {
    	 	j++;
    	 	lCard2.x += 9.4;
         	stage.update();
    	 	if (j > 50) {
    			createjs.Ticker.off("tick",leftTicker2);
     	    }
	    }
    }
}

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

    var i = 0;
    var backTicker1 = createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
    	 i++;
	  	 bCard1.x += 2.2;
	  	 bCard1.y -= 4;
         stage.update();
    	 if (i > 50) {
    		createjs.Ticker.off("tick",backTicker1);
			nextBackCard();
      }
    }

	function nextBackCard() {
    	var j = 0;
    	var backTicker2 = createjs.Ticker.addEventListener("tick", handleTick);
    	function handleTick(event) {
    	 	j++;
   		    bCard2.x += 3.5;
   		    bCard2.y -= 4;
         	stage.update();
    	 	if (j > 50) {
				tableCard();
    			createjs.Ticker.off("tick",backTicker2);
     	    }
	    }
    }

}

function pot(firstAmount, secondAmount, thridAmount, fouthAmount) {
	var pot_amount = new createjs.Text("Pot: $1000", "16px Bembo", "#FFFF00");
	pot_amount.x = 340;
	pot_amount.y = 390;
	stage.addChild(pot_amount);
	stage.update();
}

function playerAmount(username, amount) {
  var chip_plate = new createjs.Container();

  var chip_plate_background = new createjs.Shape();
  chip_plate_background.graphics.beginFill("black").drawRect(420,475,70,17);
  chip_plate.addChild(chip_plate_background)

  var chip_background = new createjs.Shape();
  chip_background.graphics.beginFill("red").drawCircle(430,483,15);
  chip_background.graphics.beginFill("white").drawCircle(430,483,12);
  chip_background.graphics.beginFill("red").drawCircle(430,483,9);
  chip_background.graphics.beginFill("red").drawPolyStar(430,483,15,8,0.5,90);
  chip_background.graphics.beginFill("white").drawCircle(430,483,2);
  chip_plate.addChild(chip_background);

  var user_amount = new createjs.Text(username + ": " + "$" + amount, "15px Bembo", "#FFFF00");
  user_amount.x = 450;
  user_amount.y = 476;
  chip_plate.addChild(user_amount);

  addToGame(chip_plate)
  stage.update();
}

function leftUserAmount(username, amount) {
  var left_chip_plate = new createjs.Container();

  var chip_plate_background = new createjs.Shape();
  chip_plate_background.graphics.beginFill("black").drawRect(30,380,88,17);

  var chip_background = new createjs.Shape();
  chip_background.graphics.beginFill("gold").drawCircle(20,390,15);
  chip_background.graphics.beginFill("blue").drawCircle(20,390,12);

  var leftAmount = new createjs.Text(username + ": " + "$" + amount, "15px Bembo","#FFFF00");
  leftAmount.x = 40;
  leftAmount.y = 380;
  left_chip_plate.addChild(chip_plate_background,chip_background,leftAmount);

  addToGame(left_chip_plate);
  stage.update();
}

function rightUserAmount(username, amount) {
  var chip_plate = new createjs.Container();

  var chip_plate_background = new createjs.Shape();
  chip_plate_background.graphics.beginFill("black").drawRect(625,380,88,17);
  chip_plate.addChild(chip_plate_background)

  var chip_background = new createjs.Shape();
  chip_background.graphics.beginFill("gold").drawCircle(615,390,15);
  chip_background.graphics.beginFill("blue").drawCircle(615,390,12);
  chip_plate.addChild(chip_background);

  var rightAmount = new createjs.Text(username + ": " + "$" + amount, "15px Bembo","#FFFF00");
  rightAmount.x = 635;
  rightAmount.y = 380;
  chip_plate.addChild(rightAmount);

  addToGame(chip_plate)
  stage.update();

}

function backUserAmount(username, amount) {
  var chip_plate = new createjs.Container();

  var chip_plate_background = new createjs.Shape();
  chip_plate_background.graphics.beginFill("black").drawRect(326,175,88,17);
  chip_plate.addChild(chip_plate_background)

  var chip_background = new createjs.Shape();
  chip_background.graphics.beginFill("gold").drawCircle(316,187,15);
  chip_background.graphics.beginFill("blue").drawCircle(316,187,12);
  chip_plate.addChild(chip_background);

  var backAmount = new createjs.Text(username + ": " + "$" + amount, "15px Bembo","#FFFF00");
  backAmount.x = 335;
  backAmount.y = 175;
  chip_plate.addChild(backAmount);

  addToGame(chip_plate)
  stage.update();
}

function flip(card,x,y) {
	var store = card;
	var flipTick = createjs.Ticker.addEventListener("tick", handleTick);
    var i = 0;
    function handleTick(event) {
   	 	i++;
   	 	store.scaleX -= 0.05;
   	 	store.x += 1.2;
        stage.update();
   	 	if (i > 20) {
			stage.removeChild(card);
			playerCards(x,y);
 			createjs.Ticker.off("tick",flipTick);
   		}
    }
}

function playerCards(x,y) {
    var deck = new Deck();
    deck.get_new_deck();
	var oneCard = deck.draw_card();

    card = oneCard.get_card_container_object(oneCard);
	card.x += x;
	card.y += y;
	card.name =  "tableCards";

    stage.addChild(card);
	stage.update();
}


function how_to_play() {
  // write tutorial
}

function play_again() {
  // write code to play again
}