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
function optionsButton() {
	var options = new button(662,575,80,30,"Options","yellow",20);
	addToGame(options);
	stage.update();
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
	var hold = new button(295,475,35,18,"call","yellow",10);
	addToGame(hold);
	stage.update();
}

function raiseButton() {
	var raise = new button(335,475,35,18,"raise", "yellow",10);
	addToGame(raise);
	stage.update();
}

function foldButton() {
	var fold = new button(375,475,35,18,"fold", "yellow",10);
	addToGame(fold);
	stage.update();
}

function startButton() {
	var start = new button(315,300,100,45,"Start", "#F00",20);
	addToMenu(start);
	stage.update();
	
	start.addEventListener("click", function(event) {
        removeMenuChildren();
        lobby();
	})
}

function howToPlayButton() {
	var how_To_Play = new button(300,370,130,45,"How To Play", "#F00",20);
	addToMenu(how_To_Play);
	stage.addChild(main_menu);
	stage.update();
}

function readyButton() {
	var ready = new button(315,300,100,45,"Ready", "#F00",20);
	addToGame(ready);
	stage.update();
	
	ready.addEventListener("click", function(event) {
        deleteItemFromGame(ready);
        socket.emit("ready");
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
