// Card Class - used by Deck
// This is a test comment
function Card(value, suit, sm, font, width, height, strokeColor, strokeThickness, backFillColor, frontFillColor)
{
  this.value = value;
  this.suit = suit;
  if (suit == "club" || suit == "spade")
    this.color = "black";
  else
    this.color = "red";
  this.sm = sm || 5.2;
  this.font = font || "30px Impact";
  this.width = width || 50
  this.height = height || 70;
  this.strokeColor = strokeColor || "gold";
  this.strokeThickness = strokeThickness || 4;
  this.backFillColor = backFillColor || "purple";
  this.frontFillColor = frontFillColor || "white";
}

Card.prototype.get_color = function()
{
  return this.color;
}

Card.prototype.get_suit = function()
{
  return this.suit
}

Card.prototype.get_suit_object = function()
{
  var suitObject;
  if (this.suit == "spade")
  {
    suitObject = get_spade_object(this.sm)
  } else if (this.suit == "heart")
  {
    suitObject = get_heart_object(this.sm)
  } else if (this.suit == "club")
  {
    suitObject = get_club_object(this.sm)
  } else
  {
    suitObject = get_diamond_object(this.sm)
  }

  return suitObject;
}

Card.prototype.get_value = function()
{
  return this.value;
}

Card.prototype.get_card_value_object = function()
{
  return get_value_object(this.value, this.color, this.font)
}

Card.prototype.get_card_back_object = function()
{
  return get_back_object(this.width, this.height, this.strokeColor, this.strokeThickness, this.backFillColor)
}

Card.prototype.get_card_front_object = function()
{
  return get_front_object(this.width, this.height, this.strokeColor, this.strokeThickness, this.frontFillColor)
}

Card.prototype.get_card_container_object = function(frontX, frontY, valueX, valueY, suitX, suitY) {
  var front = get_front_object(this.width, this.height, this.strokeColor, this.strokeThickness, this.frontFillColor);
  front.x = frontX;
  front.y = frontY;

  var value = get_value_object(this.value, this.color, this.font);
  value.x += 17;

  var suit;
  if (this.suit == "spade")
  {
	  suit = get_spade_object(this.sm);
	  suit.y += 6;
  } else if (this.suit == "heart")
  {
	  suit = get_heart_object(this.sm);
  } else if (this.suit == "club")
  {
	  suit = get_club_object(this.sm);
	  suit.y += 6;
  } else
  {
	  suit = get_diamond_object(this.sm);
  }

  suit.x -= 18;
  suit.y -= 14;

  return get_container_object(front, value, suit);
}
