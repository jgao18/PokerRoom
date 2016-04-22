var stage;

function init(){
	stage = new createjs.Stage("demoCanvas");
	timer();
}

function timer(){
	var past = new Date();
	var i = 30;
	var timeText = new createjs.Text(i, "20px Bembo", "green");
 	timeText.x = 10;
	timeText.y = 10;
	stage.addChild(timeText);
    stage.update();
	
	console.log("HELLLO");
	var timeTicker = createjs.Ticker.addEventListener("tick", handleTick);
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
				console.log("OMF");
			 	createjs.Ticker.off("tick",timeTicker);
			 }
         }
    }
}