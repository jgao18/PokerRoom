// Deck Class -- contains Card objects
function Deck(sm, font, width, height, strokeColor, strokeThickness, backFillColor, frontFillColor)
{
  this.sm = sm || 5.2;
  this.font = font || "30px Impact";
  this.width = width || 50
  this.height = height || 70;
  this.strokeColor = strokeColor || "gold";
  this.strokeThickness = strokeThickness || 4;
  this.backFillColor = backFillColor || "purple";
  this.frontFillColor = frontFillColor || "white";

  this.cardCount = 52;
  this.suits = ["heart", "spade", "diamond", "club"]
  this.values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

  this.currentDeck = [];

  this.playerCards = [];

  this.communityCards = [];

}

Deck.prototype.get_new_deck = function()
{
  var i, j;
  for (i=0; i < this.suits.length; i++)
  {
    for (j=0; j < this.values.length; j++)
    {
      this.currentDeck.push(new Card(this.values[j], this.suits[i], "INVALID_USER", this.sm, this.font, this.width, this.height, this.strokeColor,
                                      this.strokeThickness, this.backFillColor, this.frontFillColor));
    }
  }

  this.cardCount = 52;
  this.playerCards = [];
  this.communityCards = [];
}

Deck.prototype.draw_card = function(type)
{
  if (type == "player")
    this.playerCards.push(card);
  else if (type == "community")
    this.communityCards.push(card);

  var cardIndex = Math.floor((Math.random()*this.cardCount));
  var card = this.currentDeck[cardIndex];
  this.currentDeck.splice(cardIndex, 1);
  this.cardCount--;

  return card;
}

Deck.prototype.card = function()
{
  return this.currentDeck[0];
}
