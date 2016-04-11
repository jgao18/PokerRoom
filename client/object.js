// Container for main menu
var main_menu = new createjs.Container();

// Creates the Heart
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

// Creates the Spade
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

// Creates the Diamond
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

// Creates the Club
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

// Adds objects to Menu
function addToMenu(object) {
	main_menu.addChild(object);
	stage.update();
}

// Deletes certain objects from the Menu
function deleteItemMenu(object) {
	main_menu.removeChild(object);
	stage.update();
}

// Removes all items from Menu
function removeMenuChildren() {
	stage.removeChild(main_menu);
	main_menu.removeAllChildren();
	stage.update();
}

// Creates the value depending on the color
var get_value_object = function(value, color, font)
{
  if (color == "red") {
    title = new createjs.Text(value, font, "#FF0000");
  } else if (color == "black") {
    title = new createjs.Text(value, font, "#000000");
  }

  return title;
}

// ?
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

// ?
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

// ?
var get_front_object = function(width, height, strokeColor, strokeThickness, fillColor)
{
  var front = new createjs.Shape();
  front.graphics.setStrokeStyle(strokeThickness);
  front.graphics.beginStroke(strokeColor).beginFill(fillColor).drawRoundRect(0,0,width,height,5);

  return front;
}

// ?
var get_container_object = function(front, value, suit)
{
  var card_container = new createjs.Container();
  card_container.addChild(front,value,suit)

  return card_container;
}

// Provides the background for the game
var get_room_background_object = function(sm)
{
  var background = new createjs.Bitmap("/images/pokerfelt.jpg");
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

// Provides instructions for the game
function helpButton() {
	var help = new button(662,540,80,30,"Help","yellow",20);
	addToGame(help);
	stage.update();

	help.addEventListener("click", function(event) {
		alert("RANK OF HANDS\n\n1) Royal Flush\n2) Straight Flush\n3) Four of a Kind\n4) Full House\n5) Flush\n6) Straight\n7) Three of a Kind\n8) Two Pair\n9) One Pair\n10) High Card");
	})
}

// Will update later
function optionsButton() {
	var options = new button(662,575,80,30,"Options","yellow",20);
	addToGame(options);
	stage.update();

	options.addEventListener("click", function(event) {
		alert("The options button is still in development.");
	})
}


/* Isn't functioning correctly, need to fix it.
   Will remove player from the current stage. */
function leaveButton(currentPlayer) {
        
	var leave = new button(662,610,80,30,"Leave","yellow",20);
	addToGame(leave);
	stage.update();
    
        leave.addEventListener("click", function(event) {
               alert("The leave button is still in development.");
        })
        /*

	leave.addEventListener("click", function(event) {
		removeGameChildren();
        game_init();
		socket.emit("disconnect", currentPlayer.id);
	})*/
}


// Allows the user to call
function callButton() {
	var call = new button(290,475,50,18,"check/call","yellow",10);

	call.addEventListener("click", function(event) {
		var amount = getTotalBet() - getAmountBet();
		var highBet = getTotalBet();
		removePlayerChips(amount);

		var currentChips = getPlayerChips();
		var player = getCurrentPlayer();
		
		socket.emit("increase pot", {chips: amount, amount: amount});
		socket.emit("changed amount", {id: player, chips: currentChips});
		socket.emit("current turn", {action: "call", user: player, amount: highBet});
		socket.emit("buttons", {remove: false});
	})
	return call;
}

// Allows the user to raise
function raiseButton() {
	var raise = new button(345,475,50,18,"raise", "yellow",10);

	raise.addEventListener("click", function(event) {
		var show;
		
		// Restarts the betting amount
		if ((show = stage.getChildByName("bet_amount"))) {
			setAmountBet(0);
			stage.removeChild(show);
		}

		// If user wants to get out of the raise options, then press raise again
		if ((show = game_menu.getChildByName("raise_amount"))) {
			game_menu.removeChild(show);
			addCallandFoldButton();
		}
		else {
			removeCallandFoldButton();
			setAmountBet(0);
			betAmount(1);
			raiseAmount();
			betAmount(getTotalBet());
		}
	})
	return raise;
}

// Allows the user to fold
function foldButton() {
	var fold = new button(400,475,50,18,"fold", "yellow",10);

	fold.addEventListener("click", function(event) {
		var player = getCurrentPlayer();
		socket.emit("buttons", {remove: false, action: "fold"});
		socket.emit("fold",{username: player});
		socket.emit("current turn",{action: "fold", user: player});
		//socket.emit("buttons", {remove: false, action: "fold"});
	})
	return fold;
}

// Goes into the lobby once the user presses the button
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

// Once everyone presses ready, start the game
function readyButton() {
	var ready = new button(315,300,100,45,"Ready", "#F00",20);
	addToGame(ready);
	stage.update();

	ready.addEventListener("click", function(event) {
        deleteItemFromGame(ready);
        socket.emit("ready");
	})
}

// Allows the different options for raising
function raiseAmount() {

	var raise_amount = new createjs.Container();

	/* Different button options */

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

	// Once the user presses the button, then bet amount will go into the pot
	var bet_button = new button(460,445,35,18,"bet", "yellow",10);
	bet_button.addEventListener("click", function(event) {
		
		var done_raising = game_menu.getChildByName("raise_amount");
		game_menu.removeChild(done_raising);
		var store = getAmountBet();
        var lastBet = getLastUserBet();
		var diffAmount = store - lastBet;
		var highBet = getAmountBet();
		console.log("This is the high bet right now: " + highBet);
       
		//removePlayerChips(diffAmount);

		var currentChips = getPlayerChips() - diffAmount;
		var player = getCurrentPlayer();
		
		var bet;
		if (bet = stage.getChildByName("bet_amount")) {
			stage.removeChild(bet);
		}

		socket.emit("changed amount", {id: player, chips: currentChips});
		socket.emit("increase pot", {chips: diffAmount, amount: store});
		socket.emit("current turn", {action: "raise", user: player, amount: highBet});
		socket.emit("buttons", {remove: false});
	})

	raise_amount.addChild(one,five,ten,twenty,hundred,bet_button);
	raise_amount.name = "raise_amount";
	addToGame(raise_amount);
	stage.update();
}

// Once the finishes, all players must press this button to play again
function againButton() {
	var again = new button(315,245,100,45,"Again?", "#F00",20);
	addToGame(again);
	stage.update();

	again.addEventListener("click", function(event) {

		// Delete all cards
		for (var i = 0; i < 13; i ++) {
			var shape = stage.getChildByName("tableCards");
			stage.removeChild(shape);
		}

		var userStore = game_menu.getChildByName("won player");
		game_menu.removeChild(userStore);

		deleteItemFromGame(again);
		socket.emit("ready");
		//socket.emit("from again");
	})
}

// Produces the background for the game
function backgroundFelt() {
    main_background = new createjs.Bitmap("/images/pokerfelt.jpg");
    stage.addChild(main_background);
    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
      	stage.update();
    }
}

// Provides the username and the user amount for each player
function pokerChip(x, y) {
  // Used by all users
  var chip_plate = new createjs.Container();
  var chip_background = new createjs.Shape();

  // x = 490, y = 398
	chip_background.graphics.beginFill("red").drawCircle(x,y,15);
    chip_background.graphics.beginFill("white").drawCircle(x,y,12);
	chip_background.graphics.beginFill("red").drawCircle(x,y,9);
	chip_background.graphics.beginFill("red").drawPolyStar(x,y,15,8,0.5,90);
	chip_background.graphics.beginFill("white").drawCircle(x,y,2);
	chip_plate.addChild(chip_background);
	chip_plate.name = "player1_chip_plate";
	stage.addChild(chip_plate)
	stage.update();
}
