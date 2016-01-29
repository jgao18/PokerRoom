var stage, circle, text;
var canvas, context, cardNumber, buttonNames;
var width, height;
var bg, main;
var main_backgroud;
var newDeck, currentDeck, tableCards;
var cardCount;
var cardContainer ;

function init() {
  // Creating the stage
  stage = new createjs.Stage("demoCanvas");

  // Get dimensions of Canvas
  canvas = document.getElementById('demoCanvas');

  width = canvas.width;
  height = canvas.height;

  cardCount = 52;
  newDeck = ["hA","h2","h3","h4","h5","h6","h7","h8","h9","h10","hJ","hQ","hK","cA","c2","c3","c4","c5","c6","c7","c8","c9","c10","cJ",
          "cQ","cK","dA","d2","d3","d4","d5","d6","d7","d8","d9","d10","dJ","dQ","dK","sA","s2","s3","s4","s5","s6","s7","s8","s9","s10",
          "sJ","sQ","sK"];

  currentDeck = ["hA","h2","h3","h4","h5","h6","h7","h8","h9","h10","hJ","hQ","hK","cA","c2","c3","c4","c5","c6","c7","c8","c9","c10","cJ",
          "cQ","cK","dA","d2","d3","d4","d5","d6","d7","d8","d9","d10","dJ","dQ","dK","sA","s2","s3","s4","s5","s6","s7","s8","s9","s10",
          "sJ","sQ","sK"];

  tableCards = [];

  // Array of possible card numbers
  cardNumber = [1,2,3,4,5,6,7,8,9,10,"Jack","Queen","King","Ace"];

  // Array of button names
  buttonNames = ["Start","How to Play"];

  menu();
}

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
  cards();
  paint_player_cards();
  passFirstCard();
  hold();
  raise();
  fold();
}

function paint_suit(x, y, suit, sizeMultiplier)
{
  sm = sizeMultiplier;
  if (suit == "heart")
  {
    var heart = new createjs.Shape();
    heart.graphics.beginStroke("red");
    heart.graphics.beginFill("red");
    heart.graphics.drawCircle(x+sm*7.333,y+sm*12,sm*1); // left circle
    heart.graphics.drawCircle(x+sm*9.333,y+sm*12,sm*1); // right circle
    heart.graphics.lineTo(x+sm*10.333,y+sm*12.333); // moving drawing point to right, lower
    heart.graphics.lineTo(x+sm*8.333,y+sm*15.333); // right diagonal down line to middle
    heart.graphics.lineTo(x+sm*6.4,y+sm*12.333); // left diagonal left line
    return heart;
    //stage.addChild(heart);
  }
  else if (suit == "spade")
  {
    y = y + 2*sm; // positional correction
    var spade = new createjs.Shape();
    spade.graphics.beginStroke("black");
    spade.graphics.beginFill("black");
    spade.graphics.drawCircle(x+sm*7.333,y+sm*12,sm*1); // left circle
    spade.graphics.drawCircle(x+sm*9.333,y+sm*12,sm*1); // right circle
    spade.graphics.beginFill("black");
    spade.graphics.moveTo(x+sm*10.333,y+sm*11.666); // moving drawing point to right, upper
    spade.graphics.lineTo(x+sm*8.333,y+sm*8.666); // right diagonal up line to middle
    spade.graphics.lineTo(x+sm*6.4,y+sm*11.666); // left diagonal down
    spade.graphics.moveTo(x+sm*8.333,y+sm*12.333); // moving drawing point to center of 2 circles
    spade.graphics.lineTo(x+sm*9.333,y+sm*14); // right diagonal down line of triangle
    spade.graphics.lineTo(x+sm*7.333,y+sm*14); // straight line of triangle
	return spade;
    //stage.addChild(spade);
  }
  else if (suit == "diamond")
  {
    var diamond = new createjs.Shape();
    diamond.graphics.beginStroke("red");
    diamond.graphics.beginFill("red");

    diamond.graphics.moveTo(x+sm*8.333,y+sm*10.666); // starting drawing point
    diamond.graphics.lineTo(x+sm*10.333,y+sm*13); // right diagonal down \
    diamond.graphics.lineTo(x+sm*8.333,y+sm*15.666); // left diagonal down /
    diamond.graphics.lineTo(x+sm*6.333,y+sm*13); // left diagonal up \
    return diamond;
    //stage.addChild(diamond);
  }
  else if (suit == "club")
  {
    y = y + 1.5*sm; // positional correction
    var club = new createjs.Shape();
    club.graphics.beginStroke("black");
    club.graphics.beginFill("black");
    club.graphics.drawCircle(x+sm*7.333,y+sm*12,sm*1); // left circle
    club.graphics.drawCircle(x+sm*9.333,y+sm*12,sm*1); // right circle

    club.graphics.moveTo(x+sm*8.333,y+sm*10.333); // moving drawing point to center of circles
    club.graphics.lineTo(x+sm*8.333,y+sm*11.666); // line up from center of bottom circles to center of top circle
    club.graphics.endStroke();

    club.graphics.drawCircle(x+sm*8.333,y+sm*10.05,sm*1); // top circle
    club.graphics.moveTo(x+sm*8.333,y+sm*12.333); // moving drawing point to center of 2 circles
    club.graphics.lineTo(x+sm*9.333,y+sm*14); // right diagonal down line of triangle
    club.graphics.lineTo(x+sm*7.333,y+sm*14); // straight line of triangle
	return club;
    //stage.addChild(club);
  }
}

function paint_cards(card, posNumberX, posNumberY, posSuitX, posSuitY, tenAdjustment)
{
  var tenAdjustment = tenAdjustment || posNumberX; // tenAjustment - optional, in case adjustments are necessary for the two digit number
  var cardColor;
  
  var store_objects = new createjs.Container();
  var store;
  var number;

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
  
  store_objects.addChild(store, number);
  return store_objects;
}

function draw_card()
{
  var cardIndex = Math.floor((Math.random()*cardCount));
  var card = currentDeck[cardIndex];
  currentDeck.splice(cardIndex, 1);
  cardCount--;

  return card;
}

function paint_player_cards()
{
  var card1;
  var card2;
	
  var playerCardOutline1 = new createjs.Shape();
  playerCardOutline1.graphics.beginFill("white").drawRoundRect(width/2.4,height/1.2,50,70,5);
  //stage.addChild(playerCardOutline1);

  var playerCardOutline2 = new createjs.Shape();
  playerCardOutline2.graphics.beginFill("white").drawRoundRect(width/2,height/1.2,50,70,5);
  //stage.addChild(playerCardOutline2);

  card1 = paint_cards(draw_card(), width/2.27, height/1.2, width/2.6, height/1.265, width/2.3);
  card2 = paint_cards(draw_card(), width/1.9, height/1.2, width/2.13, height/1.265, width/1.95);
  
  //place the whole card in one container
  card1.addChildAt(playerCardOutline1,0);
  card2.addChildAt(playerCardOutline2,0);
  createjs.Ticker.addEventListener("tick", handleTick);
  function handleTick(event) {
	  card1.y -= 1;
	  card2.y -= 1;
    stage.update();
  }
  
  stage.addChild(card1,card2);
  
  stage.update();
  paint_flop();
}

function paint_flop()  {
  firstCard = draw_card();
  secondCard = draw_card();
  thirdCard = draw_card();

  tableCards.concat([firstCard, secondCard, thirdCard]);

  paint_cards(firstCard, width/2.66, height/2.2, width/3.1, height/2.4);
  paint_cards(secondCard, width/2.26, height/2.2, width/2.6, height/2.4);
  paint_cards(thirdCard, width/1.96, height/2.2, width/2.2, height/2.4);
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

function cards() {
  var rect = new createjs.Shape();
  rect.graphics.beginFill("purple").drawRoundRect(200,300,50,70,5);
  stage.addChild(rect);
  stage.update();
  return rect;
}

function paint_number(number, color, x,y) {
  if (color == "red") {
    title = new createjs.Text(number, "30px Impact", "#FF0000");
  } else if (color == "black") {
    title = new createjs.Text(number, "30px Impact", "#000000");
  }

  title.x = x;
  title.y = y;

  return title;
  //stage.addChild(title);
  //stage.update();
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
	var pCard1 = new createjs.Shape();
	pCard1.graphics.beginFill("purple").drawRoundRect(200,300,50,70,5);
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
	var pCard2 = new createjs.Shape();
	pCard2.graphics.beginFill("purple").drawRoundRect(200,300,50,70,5);
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
   var pCard = new createjs.Shape();
   var index = stage.numChildren;
   console.log(index);
   pCard = stage.getChildAt(index-1);
   var tick = createjs.Ticker.addEventListener("tick", handleTick);
   var i = 0;
   function handleTick(event) {
	 i++;
	 pCard.scaleX -= 0.05;
	 pCard.x += 11;
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
