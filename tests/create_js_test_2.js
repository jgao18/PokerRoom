function draw() {
	var circle = new createjs.Shape();
	circle.graphics.beginFill("red").drawCircle(0, 0, 5);
	circle.x = 20;
	circle.y = 20;
	console.log(circle.x);
	return circle;
}

function one() {
	var x = 1;
	return x;
}