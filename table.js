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

    stage.addChild(heart);
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
    stage.addChild(spade);
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

    stage.addChild(diamond);
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
    stage.addChild(club);
  }
}

function paint_cards(card, posNumberX, posNumberY, posSuitX, posSuitY, tenAdjustment)
{
  var tenAdjustment = tenAdjustment || posNumberX; // tenAjustment - optional, in case adjustments are necessary for the two digit number
  var cardColor;

  if (card.charAt(0) == "h") {
    paint_suit(posSuitX, posSuitY, "heart", 6)
    cardColor = "red";
  } else if (card.charAt(0) == "c") {
    paint_suit(posSuitX, posSuitY, "club", 6)
    cardColor = "black";
  } else if (card.charAt(0) == "d") {
    paint_suit(posSuitX, posSuitY, "diamond", 6)
    cardColor = "red";
  } else if (card.charAt(0) == 's') {
    paint_suit(posSuitX, posSuitY, "spade", 6)
    cardColor = "black";
  }

  if (card.length == 2) {
    paint_number(card.charAt(1), cardColor, posNumberX, posNumberY);
  } else if (card.length == 3) {
    paint_number(card.substr(1,2), cardColor, tenAdjustment, posNumberY);
  }
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
  var playerCardOutline1 = new createjs.Shape();
  playerCardOutline1.graphics.beginFill("white").drawRoundRect(width/2.4,height/1.2,50,70,5);
  stage.addChild(playerCardOutline1);

  var playerCardOutline2 = new createjs.Shape();
  playerCardOutline2.graphics.beginFill("white").drawRoundRect(width/2,height/1.2,50,70,5);
  stage.addChild(playerCardOutline2);

  paint_cards(draw_card(), width/2.27, height/1.2, width/2.6, height/1.265, width/2.3);
  paint_cards(draw_card(), width/1.9, height/1.2, width/2.13, height/1.265, width/1.95);

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
}

function paint_number(number, color, x,y) {
  if (color == "red") {
    title = new createjs.Text(number, "30px Impact", "#FF0000");
  } else if (color == "black") {
    title = new createjs.Text(number, "30px Impact", "#000000");
  }

  title.x = x;
  title.y = y;

  stage.addChild(title);
  stage.update();
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

function how_to_play() {
  // write tutorial
}

function play_again() {
  // write code to play again
}
