function init() {
	var stage = new createjs.Stage("demoCanvas");

	var background = new get_room_background_object(2);

	var heart = get_heart_object(6);
	heart.x = 50;
	heart.y = 50;

	var spade = get_spade_object(10);
	spade.x = 100;
	spade.y = 100;

	var diamond = get_diamond_object(14);
	diamond.x = 150;
	diamond.y = 150;

	var club = get_club_object(18);
	club.x = 200;
	club.y = 200;

	var value = get_value_object(10, "red", "40px Impact");
	value.x = 100;
	value.y = 150;

	var value2 = get_value_object("K", "black", "80px Impact");
	value2.x = 100;
	value2.y = 200;

	var back = get_back_object(100, 140, "gold", 4, "purple");
	back.x = 100;
	back.y = 300;

	var front = get_front_object(100, 140, "gold", 4, "white");
	front.x = 400;
	front.y = 200;

	var card_front = get_front_object(40, 60, "gold", 4, "white");
	var card_heart =  get_heart_object(6);
	card_heart.x = -30;
	card_heart.y = -35;
	var card_value = get_value_object("A", "red", "30px Impact");
	card_value.x = 12;
	card_value.y = -2;

	var card = get_container_object(card_front, card_value, card_heart)
	card.x = 00;
	card.y = 450;

	//var realCard = new Card("K", "spade", 50, 50, 2);
	//var realCardObject = realCard.get_card_object();

	stage.addChild(background);
	stage.addChild(heart);
	stage.addChild(spade);
	stage.addChild(diamond);
	stage.addChild(club);
	stage.addChild(value);
	stage.addChild(value2);
	stage.addChild(back);
	stage.addChild(front);
	//stage.addChild(card_front)
	//stage.addChild(card_heart);
	//stage.addChild(card_value);
	stage.addChild(card);

	createjs.Ticker.addEventListener("tick", handleTick);
  function handleTick(event) {
  	card.x += 1;
		stage.update();
	}
}
