// Container for main menu
var main_menu = new createjs.Container();

var get_heart_object = function(sm)
{
  var heart = new createjs.Shape();
  heart.graphics.beginStroke("red");
  heart.graphics.beginFill("red");
  heart.graphics.drawCircle(sm*7.333,sm*12,sm*1); // left circle
  heart.graphics.drawCircle(sm*9.333,sm*12,sm*1); // right circle
  heart.graphics.lineTo(sm*10.333,sm*12.333); // moving drawing point to right, lower
  heart.graphics.lineTo(sm*8.333,sm*15.333); // right diagonal down line to middle
  heart.graphics.lineTo(sm*6.4,sm*12.333); // left diagonal left line
  return heart;
}

var get_spade_object = function(sm)
{
  var spade = new createjs.Shape();
  spade.graphics.beginStroke("black");
  spade.graphics.beginFill("black");
  spade.graphics.drawCircle(sm*7.333,sm*12,sm*1); // left circle
  spade.graphics.drawCircle(sm*9.333,sm*12,sm*1); // right circle
  spade.graphics.beginFill("black");
  spade.graphics.moveTo(sm*10.333,sm*11.666); // moving drawing point to right, upper
  spade.graphics.lineTo(sm*8.333,sm*8.666); // right diagonal up line to middle
  spade.graphics.lineTo(sm*6.4,sm*11.666); // left diagonal down
  spade.graphics.moveTo(sm*8.333,sm*12.333); // moving drawing point to center of 2 circles
  spade.graphics.lineTo(sm*9.333,sm*14); // right diagonal down line of triangle
  spade.graphics.lineTo(sm*7.333,sm*14); // straight line of triangle
  return spade;
}

var get_diamond_object = function(sm)
{
  var diamond = new createjs.Shape();
  diamond.graphics.beginStroke("red");
  diamond.graphics.beginFill("red");

  diamond.graphics.moveTo(sm*8.333,sm*10.666); // starting drawing point
  diamond.graphics.lineTo(sm*10.333,sm*13); // right diagonal down \
  diamond.graphics.lineTo(sm*8.333,sm*15.666); // left diagonal down /
  diamond.graphics.lineTo(sm*6.333,sm*13); // left diagonal up \
  return diamond;
}

var get_club_object = function(sm)
{
  sm = sm || 6;
  var club = new createjs.Shape();
  club.graphics.beginStroke("black");
  club.graphics.beginFill("black");
  club.graphics.drawCircle(sm*7.333,sm*12,sm*1); // left circle
  club.graphics.drawCircle(sm*9.333,sm*12,sm*1); // right circle

  club.graphics.moveTo(sm*8.333,sm*10.333); // moving drawing point to center of circles
  club.graphics.lineTo(sm*8.333,sm*11.666); // line up from center of bottom circles to center of top circle
  club.graphics.endStroke();

  club.graphics.drawCircle(sm*8.333,sm*10.05,sm*1); // top circle
  club.graphics.moveTo(sm*8.333,sm*12.333); // moving drawing point to center of 2 circles
  club.graphics.lineTo(sm*9.333,sm*14); // right diagonal down line of triangle
  club.graphics.lineTo(sm*7.333,sm*14); // straight line of triangle
  return club;
}

// Access this function to atler the menu Container
function addToMenu(object) {
	main_menu.addChild(object);
	stage.update();
}

function deleteItemMenu(object) {
	main_menu.removeChild(object);
	stage.update();
}
	
function removeMenuChildren() {
	stage.removeChild(main_menu);
	main_menu.removeAllChildren();
	stage.update();
}

var get_value_object = function(value, color, font)
{
  if (color == "red") {
    title = new createjs.Text(value, font, "#FF0000");
  } else if (color == "black") {
    title = new createjs.Text(value, font, "#000000");
  }

  return title;
}

var get_dealer_chip = function(sm)
{
	var dealer_chip = new createjs.Container();
	var dealer_chip_text = new createjs.Text("DEALER", "20px Bembo", "#000");
	dealer_chip_text.textBaseline = "top";
	dealer_chip_text.textAlign = "center";
	
	var width = dealer_chip_text.getMeasuredWidth()+15;
	var height = dealer_chip_text.getMeasuredHeight()+7;
	
	dealer_chip_text.x = 700;
    dealer_chip_text.y = 579;
    
    var background = new createjs.Shape();
	background.graphics.beginFill("white").drawCircle(662,575,width,height,10);

	dealer_chip.addChild(background,dealer_chip_text)
	stage.addChild(dealer_chip);
	stage.update();
}


var get_back_object = function(width, height, strokeColor, strokeThickness, fillColor)
{
  strokeColor = strokeColor;
  strokeThickness = strokeThickness;
  fillColor = fillColor;

  var back = new createjs.Shape();
  back.graphics.setStrokeStyle(strokeThickness);
  back.graphics.beginStroke(strokeColor).beginFill(fillColor).drawRoundRect(0,0,width,height,5);

  return back;
}

var get_front_object = function(width, height, strokeColor, strokeThickness, fillColor)
{
  var front = new createjs.Shape();
  front.graphics.setStrokeStyle(strokeThickness);
  front.graphics.beginStroke(strokeColor).beginFill(fillColor).drawRoundRect(0,0,width,height,5);

  return front;
}

var get_container_object = function(front, value, suit)
{
  var card_container = new createjs.Container();
  card_container.addChild(front,value,suit)

  return card_container;
}

var get_room_background_object = function(sm)
{
  var background = new createjs.Bitmap("../images/pokerfelt.jpg");
  background.scaleX = sm;
  background.scaleY = sm;

  return background;
}

// Indicates which user's turn
function turn_signal(user) {
	var signal = new createjs.Shape();
	signal.graphics.beginStroke("#FFFF00").beginFill("#FFFF00");
	
	// Depending on which user, provide the user signal
	switch (user) {
		    // left
		case 3:
			signal.graphics.moveTo(643, 260).lineTo(703, 260).lineTo(673, 280).lineTo(643, 260);
			break;
			// back
		case 2:
			signal.graphics.moveTo(340, 60).lineTo(400, 60).lineTo(370, 80).lineTo(340, 60);
			break;
			// right 
		case 1:
			signal.graphics.moveTo(43, 260).lineTo(103, 260).lineTo(73, 280).lineTo(43, 260);
			break;
			// main
		case 0:
			signal.graphics.moveTo(515, 540).lineTo(545, 510).lineTo(545, 570).lineTo(515, 540);
			break;
	}
	signal.name = "signal";
	return signal;
}

// Allows a user to create a button with specifications
function button(x,y,width,height,label,color,textSize) {
	// The container which the button will be put
    var user_button = new createjs.Container();

	// Creating the text for button
	var text;
	switch (textSize) {
		case 10:
			text = new createjs.Text(label, "10px Bembo", "#000");
			text.y -= 2;
			break;
		case 20:
			text = new createjs.Text(label, "20px Bembo", "#000");
			break;
	}
    text.textBaseline = "top";
    text.textAlign = "center";
	
	// Setting text coordinates
    text.x += x + (width/2);
    text.y += y + (height/4);

	// Creating the button shape
    var background = new createjs.Shape();
    background.graphics.beginFill(color).drawRoundRect(x,y,width,height,10);

	// Adding the button shape and text to container
    user_button.addChild(background, text)
    return user_button;
}
	
/* All are buttons for the game */

/* For this button, I'd like an alert popup to occur on-click, but I want
 * it to look nicer than the default popup (background color, font size, 
 * font color, etc.
*/
function helpButton() {
	var help = new button(662,540,80,30,"Help","yellow",20);
	addToGame(help);
	stage.update();
	
	help.addEventListener("click", function(event) {
		alert(" Royal Flush: A royal flush is an ace high straight flush. For example, A-K-Q-J-10 all of diamonds. \n Straight Flush: A straight flush is a five-card straight, all in the same suit. For example, 7-6-5-4-3 all of clubs. \n Four of a Kind: Four of a kind, or quads, are four cards of equal value. For example, four jacks. \n Full House: A full house contains a set (3) of cards of one value and a pair of another value. For example, Q-Q-Q-2-2. \n Flush: A flush is any 5 cards, all of the same suit. For example, K-Q-9-6-3 all of diamonds. \n Straight: Five cards of sequential value. Every possible straight will contain either a 5 or a 10. For example, 7-6-5-4-3 with different suits. \n Three of a Kind: Three cards of the same value. For example, three aces. \n Two Pairs: This is two cards of one value and another two cards of another value. For example, two jacks and two 8s. \n Pair: One pair is two cards of the same rank. For example, two queens. \n High Card: The hand with the highest card(s) wins. If two or more players hold the highest card, a kicker comes into play (see below).");
	})
}	

function optionsButton() {
	var options = new button(662,575,80,30,"Options","yellow",20);
	addToGame(options);
	stage.update();
	
	options.addEventListener("click", function(event) {
		alert("Hi!");
	})	
}

/* Good start on the leave Button. 
   Need to complete:
	  - Put all other characters into a container for easy deletion
	  - Once a player leaves a game, all players screens are updated.
      - Have all Playerlist updated once a player leaves correctly.
*/
function leaveButton(currentPlayer) {
	var leave = new button(662,610,80,30,"Leave","yellow",20);
	addToGame(leave);
	stage.update();
	
	leave.addEventListener("click", function(event) {
		removeGameChildren();		
        game_init();
		socket.emit("leave", currentPlayer.id);
	})
}



function callButton() {
	var call = new button(295,475,35,18,"call","yellow",10);
	//addToGame(call);
	//stage.update();
	call.addEventListener("click", function(event) {	
		//socket.emit("buttons");
		socket.emit("current turn");
		socket.emit("buttons");
		//socket.emit("buttons");
	})
	return call;
}

// If someone raises, then 
function raiseButton() {
	var raise = new button(335,475,35,18,"raise", "yellow",10);
	
	raise.addEventListener("click", function(event) {
		var show;
		if ((show = stage.getChildByName("bet_amount"))) {
			setAmountBet(0);
			stage.removeChild(show);
		}
		
		if ((show = game_menu.getChildByName("raise_amount"))) {
			game_menu.removeChild(show);
		} 
		else {
			raiseAmount();
		}
	})
	return raise;
}

function foldButton() {
	var fold = new button(375,475,35,18,"fold", "yellow",10);
	//addToGame(fold);
	//stage.update();
	fold.addEventListener("click", function(event) {
		// We need some way to indicate two things:
		//socket.emit("buttons");
		socket.emit("fold");
		socket.emit("current turn");
		socket.emit("buttons");
		//socket.emit("buttons");
	})
	return fold;
}

function startButton() {
	var start = new button(315,300,100,45,"Start", "#F00",20);
	addToMenu(start);
	stage.addChild(main_menu);
	stage.update();
	
	start.addEventListener("click", function(event) {
        removeMenuChildren();
        lobby();
	})
}

function readyButton() {
	var ready = new button(315,300,100,45,"Ready", "#F00",20);
	addToGame(ready);
	stage.update();
	
	ready.addEventListener("click", function(event) {
		console.log("Why is printing in the readyButton twice");
        deleteItemFromGame(ready);
        socket.emit("ready");
	})
}

function raiseAmount() {
	var raise_amount = new createjs.Container();
	var one = new button(260,445,35,18,"1", "yellow",10);
	one.addEventListener("click", function(event) {
		betAmount(1);
	})
	
	var five = new button(300,445,35,18,"5", "yellow",10);
	five.addEventListener("click", function(event) {
    	betAmount(5);
	})
	
	var ten = new button(340,445,35,18,"10", "yellow",10);
	ten.addEventListener("click", function(event) {
  	    betAmount(10);
	})
	
	var twenty = new button(380,445,35,18,"20", "yellow",10);
	twenty.addEventListener("click", function(event) {
        betAmount(20);
	})
	
	var hundred = new button(420,445,35,18,"100", "yellow",10);
	hundred.addEventListener("click", function(event) {
        betAmount(100);
	})
	
	var bet_button = new button(460,445,35,18,"bet", "yellow",10);
	bet_button.addEventListener("click", function(event) {
		var done_raising = game_menu.getChildByName("raise_amount");
		game_menu.removeChild(done_raising);
       	
		var store = getAmountBet();
		removePlayerChips(store);
		
		var currentChips = getPlayerChips();
		var player = getCurrentPlayer();
		playerAmount(player, currentChips);
		socket.emit("increase pot", {chips: store});
		socket.emit("current turn");
		socket.emit("buttons");
	})
	
	betAmount(0);
	raise_amount.addChild(one,five,ten,twenty,hundred,bet_button);
	raise_amount.name = "raise_amount";
	addToGame(raise_amount);
	stage.update();
}

function againButton() {
	var again = new button(315,245,100,45,"Again?", "#F00",20);
	addToGame(again);
	stage.update();
	
	again.addEventListener("click", function(event) {
		
		for (var i = 0; i < 13; i ++) {
			var shape = stage.getChildByName("tableCards");
			stage.removeChild(shape);
		}
		
		var userStore = game_menu.getChildByName("won player");
		game_menu.removeChild(userStore);
		
		deleteItemFromGame(again);
		socket.emit("ready");
		socket.emit("from again");
	})
}

function backgroundFelt() {
    main_background = new createjs.Bitmap("../images/pokerfelt.jpg");
    stage.addChild(main_background);
    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
      	stage.update();
    }
}
