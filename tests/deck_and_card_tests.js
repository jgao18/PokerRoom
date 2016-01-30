function init() {
	var stage = new createjs.Stage("demoCanvas");

  var deck = new Deck();
  deck.get_new_deck();

  var oneCard = deck.draw_card();

  suit = oneCard.get_suit_object();
  value = oneCard.get_card_value_object();
  value.x = 42;
  value.y = 22;
  back = oneCard.get_card_back_object();
  front = oneCard.get_card_front_object();
  front.x = 25;
  front.y = 22;
  card = oneCard.get_card_container_object(front, value, suit);

  stage.addChild(card);

	createjs.Ticker.addEventListener("tick", handleTick);
  function handleTick(event) {
		stage.update();
	}
}
