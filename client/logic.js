// How do I pass in the table cards? 
// I will pass in the table cards and the a player's cards
var suits = ["heart", "spade", "diamond", "club"];
var values = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
var keyDict = {"A": 0, "K": 1, "Q": 2, "J": 3, "10": 4, "9": 5, "8": 6, "7": 7, "6": 8, "5": 9, "4": 10, "3": 11, "2": 12};
//dictonary with values and points
// sort then reverse
//var deck;

suitTest();

function sortNumber(a,b) {
    return a - b;
}

function suitTest() {
	var deck = new Deck();
	deck.get_new_deck();
	var cardList = [];
	var testList = [];

	for (var i = 0; i < 7; i++) {
		cardList.push(deck.draw_card());
		testList.push(cardList[i].get_value());
	}

	var winner = determineWinner(cardList);
	winner += isOrder(cardList);
	winner += isPairs(cardList);
	console.log(winner);

	testList.sort();
	
	for (var i =0; i < testList.length; i++) {
		console.log(testList[i]);
	}
	
	switch (winner) {
		case "YYN": 
			console.log("Royal or Straight Flush");
			break;
		case "YYN":
			console.log("Royal or Straight Flush");
			break;
		case "YNY":
			console.log("Flush");
			break;
		case "YNN":
			console.log("Flush");
			break;
		case "NYY":
			console.log("Straight");
			break;
		case "NYN":
			console.log("Straight");
			break;
		case "NNY":
			console.log("4/3/2 of kind or 2 Pair or Full House");
			break;
		case "NNN":
			console.log("High Card");
			break;
	}
	
	testing();
	pairTesting();
}
// will take in a list of cards
function determineWinner(cards) {
	// Will I need to sort the list
	var points = 0;
	var testList = [];
	//sortCards(testList);
	
	var heart = 0;
	var spade = 0;
	var diamond = 0;
	var club = 0;
	for(var i = 0; i < cards.length; i++) {
		switch(cards[i].get_suit()) {
			case "heart":
				heart++;
				break;
			case "spade":
				spade++;
				break;
			case "diamond":
				diamond++;
				break;
			case "club":
				club++;
				break;
		}
	}
	
	console.log("Heart is " + heart);
	console.log("Spade is " + spade);
	console.log("Diamond is " + diamond);
	console.log("Club is " + club);
	if((heart>4) || (spade>4) || (diamond>4) || (club>4)) {
		points = "Y";
		return points;
	}
	else {
		points = "N";
	}
	return points;
}

function sortCards(cards) {
	//console.log("In sort cards");
	var valueList = [];
	var pointList = [];
	
	for (var i = 0; i < cards.length; i++) {
		valueList.push(cards[i].get_value());
	}
	
	for (var i = 0; i < cards.length; i++) {
		pointList.push(keyDict[valueList[i]]);
	}
	pointList.sort(sortNumber);
	
	return pointList;
}

function isOrder(cards) {
	
	var orderList = sortCards(cards);
	
	var order = 0;
	for (var i = 0; i < (orderList.length-1); i++) {
		if ((orderList[i] + 1) == orderList[i+1] ) {
			order++;
			if (order > 3) {
				return "Y";
			}
		}
		else if (orderList[i+1] == orderList[i]){
			continue;
		}
		else {
			order = 0;
		}
	}
	
	return "N";
}

function isPairs(cards) {
	var newList = [];
	var pairList = sortCards(cards);
	
	for (var i = 0; i < cards.length; i++) {
		console.log(pairList[i]);
		newList.push(values[pairList[i]]);
	}
	
	var pairs = {};
	var numOfCards = 1;
	for (var i = 0; i < (newList.length-1); i++) {
		if (newList[i] == newList[i+1]) {
			numOfCards++; 
			pairs[newList[i]] = numOfCards;
		}
		else {
			numOfCards = 1;
		}
	}
	
	for (var i = 0; i < values.length; i++) {
		if( pairs[values[i]] > 1) {
			return "Y";
		}
	}
	
	return "N";
}

function testing() {
	var list = [1,2,2,3,4,5,7];
	var order = 0;
	
	for (var i = 0; i < (list.length-1); i++) {
		if ((list[i] + 1) == list[i+1] ) {
			order++;
			if (order > 3) {
				console.log("Its in order");
				break;
			}
		}
		else if (list[i+1] == list[i]){
			continue;
		}
		else {
			order = 0;
		}
	}
}

function pairTesting() {
	var list = ["A","A","K","5","3","3","2"];
	
	var pairs = {};
	var numOfCards = 1;
	for (var i = 0; i < list.length; i++) {
		if (list[i] == list[i+1]) {
			numOfCards++;
			pairs[list[i]] = numOfCards;
		}
		else {
			numOfCards = 1;
		}
	}
	
	var store;
	for (var i = 0; i < values.length; i++) {
		if(store = pairs[values[i]]) {
		}
	}
}
