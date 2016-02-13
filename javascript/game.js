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
  
  createjs.Ticker.setInterval(10);
  createjs.Ticker.setFPS(10);
  
  createjs.Ticker.TIMEOUT 

  // Array of button names
  buttonNames = ["Start","How to Play"];
  
  //createjs.Ticker.timingMode = createjs.Ticker.RAF;
  //createjs.Ticker._raf = false;
  //createjs.Ticker.timingMode = createjs.Ticker.RAF;
  //createjs.Ticker.timingMode = null;
  
  /*document.addEventListener("visibilitychange", function() {
	  if (document.visibilityState == "hidden") {
		  createjs.Ticker.timingMode = createjs.Ticker.TIMEOUT;
	  }
      //console.log( document.visibilityState );
  });*/
  
  menu();

  //socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
}