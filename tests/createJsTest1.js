function init() {
	var stage = new createjs.Stage("demoCanvas");
	var store = new createjs.Shape();
	store = draw();
	var s = store.x;
	console.log(s);
	stage.addChild(store);
	stage.update();
}