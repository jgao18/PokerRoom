var stage, circle, text;
var canvas, context, buttonNames;
var width, height;
var bg, main;
var main_backgroud;
var deck;
var socket;

function init() {
  // Creating the stage
  stage = new createjs.Stage("demoCanvas");

  // Get dimensions of Canvas
  canvas = document.getElementById('demoCanvas');

  width = canvas.width;
  height = canvas.height;

  deck = new Deck();
  deck.get_new_deck();

  // Array of button names
  buttonNames = ["Start","How to Play"];

  menu();

  socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
}

var setEventHandlers = function() {
	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);

	// Player move message received
	socket.on("move player", onMovePlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);
};

// main menu to game
function menu() {

  // adding background image
  main_background = new createjs.Bitmap("images/pokerfelt.jpg");
  stage.addChild(main_background);
  createjs.Ticker.addEventListener("tick", handleTick);
  function handleTick(event) {
    stage.update();
  }

  // Title of Game
  title = new createjs.Text("Let's Play Poker", "50px Bembo", "#FF0000");
  title.x = width/3.5;
  title.y = height/4;

  // Creating Buttons for Game
  var start = new button(width/2.3,height/2.3,"Start", "#F00");
  var how_to_play = new button(width/2.53,height/1.8, "How to Play", "#F00")

  // adding the title to canvas
  stage.addChild(title);

  // update to show title
  stage.update();
}

// Starts game
function start_game() {
  document.getElementById("demoCanvas").style.background = '#FF0000';
  pokertable();
  paint_deck();
  passFirstCard();
  hold();
  raise();
  fold();
}

function paint_card(card, posNumberX, posNumberY, posSuitX, posSuitY, tenAdjustment)
{

  if (card.charAt(0) == "h") {
    store = paint_suit(posSuitX, posSuitY, "heart", 6)
    cardColor = "red";
  } else if (card.charAt(0) == "c") {
    store = paint_suit(posSuitX, posSuitY, "club", 6)
    cardColor = "black";
  } else if (card.charAt(0) == "d") {
    store = paint_suit(posSuitX, posSuitY, "diamond", 6)
    cardColor = "red";
  } else if (card.charAt(0) == 's') {
    store = paint_suit(posSuitX, posSuitY, "spade", 6)
    cardColor = "black";
  }

  if (card.length == 2) {
    number = paint_number(card.charAt(1), cardColor, posNumberX, posNumberY);
  } else if (card.length == 3) {
    number = paint_number(card.substr(1,2), cardColor, tenAdjustment, posNumberY);
  }

  var tenAdjustment = tenAdjustment || posNumberX; // tenAjustment - optional, in case adjustments are necessary for the two digit number
  var cardColor;

  var store_objects = new createjs.Container();
  var store;
  var number;

  store_objects.addChild(store, number);
  return store_objects;
}


// Creates the poker table and background
function pokertable() {
  // Retrieving the pokertable and background
  var poker_menu = new createjs.Container();
  var game_background = new createjs.Bitmap("images/pokerfelt.jpg");
  var table = new createjs.Bitmap("images/pokertable.png");

  // adjusting the location of the table
  table.x = width/6.5;
  table.y = height/3;
  // adding the table and background to container and stage
  poker_menu.addChild(game_background, table);
  stage.addChild(poker_menu);
  createjs.Ticker.addEventListener("tick", handleTick);
  function handleTick(event) {
       stage.update();
  }
}

function button(x,y,label,color) {

  var user_button = new createjs.Container();

  var text = new createjs.Text(label, "20px Bembo", "#000");
  text.textBaseline = "top";
  text.textAlign = "center";

  var width = text.getMeasuredWidth()+30;
  var height = text.getMeasuredHeight()+20;

  text.x = width/2 + x;
  text.y = 10 + y;

  var background = new createjs.Shape();
  background.graphics.beginFill(color).drawRoundRect(x,y,width,height,10);

  user_button.addChild(background, text)
  stage.addChild(user_button);

  var i;
  for (i = 0; i < buttonNames.length; i++)
  {
    if (label == buttonNames[i]){
      user_button.addEventListener("click", function(event) {

        if(label == "Start")
        {
          stage.removeChild(user_button);
          start_game();
        }

        if(label == "How to Play")
        {
          alert("Instructions");
        }
      })
    }
  }
}

function hold() {

	var hold_button = new createjs.Container();
    var hold_text = new createjs.Text("hold", "10px Bembo", "#000");
    hold_text.textBaseline = "top";
    hold_text.textAlign = "center";

    var width = hold_text.getMeasuredWidth()+15;
    var height = hold_text.getMeasuredHeight()+7;

    hold_text.x = 316.5;
    hold_text.y = 478;

    var background = new createjs.Shape();
    background.graphics.beginFill("yellow").drawRoundRect(300,475,width,height,10);

    hold_button.addChild(background, hold_text)
    stage.addChild(hold_button);
	stage.update();
}

function raise() {

	var raise_button = new createjs.Container();
    var raise_text = new createjs.Text("raise", "10px Bembo", "#000");
    raise_text.textBaseline = "top";
    raise_text.textAlign = "center";

    var width = raise_text.getMeasuredWidth()+15;
    var height = raise_text.getMeasuredHeight()+7;

    raise_text.x = 357;
    raise_text.y = 478;

    var background = new createjs.Shape();
    background.graphics.beginFill("yellow").drawRoundRect(340,475,width,height,10);

    raise_button.addChild(background,raise_text)
    stage.addChild(raise_button);
	stage.update();
}

function fold() {

	var fold_button = new createjs.Container();
    var fold_text = new createjs.Text("fold", "10px Bembo", "#000");
    fold_text.textBaseline = "top";
    fold_text.textAlign = "center";

    var width = fold_text.getMeasuredWidth()+15;
    var height = fold_text.getMeasuredHeight()+7;

    fold_text.x = 396;
    fold_text.y = 478;

    var background = new createjs.Shape();
    background.graphics.beginFill("yellow").drawRoundRect(380,475,width,height,10);

    fold_button.addChild(background,fold_text)
    stage.addChild(fold_button);
	stage.update();
}


function paint_deck() {

  var card_back = deck.card().get_card_back_object();
  card_back.x = 200;
  card_back.y = 300;
  stage.addChild(card_back);
}

function cardBack() {
	var back = new createjs.Shape();
	back.graphics.beginFill("purple").drawRoundRect(200,300,50,70,5);
	return back;
}

// Still needs work
function tableCard() {
	var tCard1 = new createjs.Shape();
	var tCard2 = new createjs.Shape();
	var tCard3 = new createjs.Shape();
	var tCard4 = new createjs.Shape();
	var tCard5 = new createjs.Shape();
	var tCard1 = cardBack();
	var tCard2 = cardBack();
	var tCard3 = cardBack();
	var tCard4 = cardBack();
	var tCard5 = cardBack();
	var limit = 12;
	stage.addChild(tCard1,tCard2,tCard3,tCard4,tCard5);
	var cards = [tCard1,tCard2,tCard3,tCard4,tCard5];
	// So I could put this is an array then access one at a time
	var i;
	var j = 0;
	var tableTicker = createjs.Ticker.addEventListener("tick", handleTick);
	for (i = 0; i < 5 ; i++) {
	   var store = cards[i];
	   function handleTick(event) {
		 j++;
		 store.x += 12;
	     stage.update();
		 if (j > 20) {
			createjs.Ticker.off("tick",tableTicker);
			limit--;
		 }
		 console.log(i);
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
			rotateCards();
		 }
    }
}

function rotateCards() {
   var pCard = deck.card().get_card_back_object();
   var index = stage.numChildren;
   console.log(index);
   pCard = stage.getChildAt(index-1);
   var tick = createjs.Ticker.addEventListener("tick", handleTick);
   var i = 0;
   function handleTick(event) {
  	 i++;
  	 pCard.scaleX -= 0.05;
  	 pCard.x += 2;
       stage.update();
  	 if (i > 20) {
  		createjs.Ticker.off("tick",tick);
  		tableCard();
  	 }
   }
}


function how_to_play() {
  // write tutorial
}

function play_again() {
  // write code to play again
}
