// These tests print to the console

// How do I pass in the table cards?
// I will pass in the table cards and the a player's cards
var suits = ["heart", "spade", "diamond", "club"];
var values = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
var keyDict = {"A": 0, "K": 1, "Q": 2, "J": 3, "10": 4, "9": 5, "8": 6, "7": 7, "6": 8, "5": 9, "4": 10, "3": 11, "2": 12};
//dictonary with values and points
// sort then reverse
//var deck;

function sortNumber(a,b) {
    return a - b;
}

function determineWinner(cardList) {
	//var deck = new Deck();
	//deck.get_new_deck();
	//var cardList = [];
	var testList = [];

	for (var i = 0; i < 7; i++) {
		cardList.push(deck.draw_card());
		testList.push(cardList[i].get_value());
	}

	var winner = isSuit(cardList);
	winner += isOrder(cardList);
	winner += isPairs(cardList);
	console.log(winner);

	testList.sort();

	for (var i =0; i < testList.length; i++) {
		console.log(testList[i]);
	}

	var hand;
	switch (winner) {
		// suit/order/value
		case "YYN":
			console.log("Royal or Straight Flush");
			return whichFlush(cardList);
			break;
		case "YNY":
			console.log("Flush");
			return "Flush";
			break;
		case "YNN":
			console.log("Flush");
			return "Flush";
			break;
		case "NYY":
			console.log("Straight");
			return "Straight";
			break;
		case "NYN":
			console.log("Straight");
			return "Straight";
			break;
		case "NNY":
			console.log("4/3/2 of kind or 2 Pair or Full House");
			return whichPair(cardList);
			break;
		case "NNN":
			console.log("High Card");
			return "High Card";
			break;
	}
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

function isSuit(cards) {
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
	var pairList = cards;

	for (var i = 0; i < cards.length; i++) {
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

function whichFlush(cards) {
	var flushList = sortCards(cards);

	var isRoyal = 0;
	for (var i = 0; i < 5; i++) {
		if (flushList[i] == i) {
			isRoyal++;
		}
	}

	if (isRoyal > 4) {
		return "Royal Flush";
	}
	else {
		return "Straight Flush";
	}
}

function findValue(dict,keyList,times,extra) {
	for(var i = 0; i < keyList.length; i++) {
		console.log("This is keyList[i] " + keyList[i]);
		console.log(times);
		if(dict[keyList[i]] == times && keyList[i] != extra) {
			return keyList[i];
		}
	}
}


function whichPair(cards) {
	var newList = [];
	var pairList = sortCards(cards);

	// Find the values that are associate to the points
	for (var i = 0; i < pairList.length; i++) {
		newList.push(values[pairList[i]]);
	}

	var pairs = {};
	var numOfCards = 1;
	for (var i = 0; i < newList.length; i++) {
		// If the next value is the current value, then skip
		if (comp == newList[i]) {
			continue;
		}
		var comp = newList[i];
		// Look through the list and see if the value appears again
		for (var j = i; j < (newList.length-1); j++) {
			if (comp == newList[j+1]) {
				numOfCards++;
			}
		}
		// If there are multiple card values, then store it inside the dictionary
		if (numOfCards > 1) {
			pairs[comp] = numOfCards;
		}
		numOfCards = 1;
	}

	var keyList = Object.keys(pairs);
	console.log(pairs);
	console.log(keyList);
	var finalDict = {};
	var fourOfaKind = 0;
	var threeOfaKind = 0;
	var pair = 0;
	for (var i = 0; i < keyList.length; i++) {
		switch(pairs[keyList[i]]) {
			case 4:
				fourOfaKind++;
				break;
			case 3:
				threeOfaKind++;
				break;
			case 2:
				pair++;
				break;
		}
	}

	var returnValue;
	var extraValue;
	if(fourOfaKind == 1) {
		returnValue = findValue(pairs,keyList,4);
		console.log("It is a four of a kind of " + returnValue);
		return "Four of a Kind of " + returnValue;
	}
	else if(threeOfaKind == 1 && pair == 1) {
		returnValue = findValue(pairs,keyList,3);
		extraValue = findValue(pairs,keyList,2);
		console.log("It is a Full House with " + returnValue + " and " + extraValue);
		return "Full House with " + returnValue + " and " + extraValue;
	}
	else if(threeOfaKind == 1) {
		returnValue = findValue(pairs,keyList,3);
		console.log("It is a three of a kind of " + returnValue);
		return "Full "
	}
	else if(pair > 1) {
		returnValue = findValue(pairs,keyList,2);
		extraValue = findValue(pairs,keyList,2,returnValue);
		console.log("It is a two pair with " + returnValue + " and " + extraValue);
	}
	else if(pair == 1) {
		returnValue = findValue(pairs,keyList,2);
		console.log("It is a pair of " + returnValue);
	}

}

function finalEvaluation(user1List, user2List, user1Results,user2Results) {
    var userPoints = 0;

	//What if we looked into the result string and find the values
	//Need something for pair/two pair/threeokakind/FullHouse/FourofKind
	var user1Value;
	var user2Value;
	//var userValueList = [];
	//userValueList.push(user1Value);
	//userValueList.push(user2Value);
	// What happens when both users have the same pair, then we must evaluate by highest card
	if(isPairs(user1List) == "Y") {
		for(var i = 0; i < values.length; i++) {
			if(user1Results.includes(values[i])) {
				user1Value = keyDict[values[i]];
				break;
			}
		}

		for(var i = 0; i < values.length; i++) {
			if(user2Results.includes(values[i])) {
				user2Value = keyDict[values[i]];
				break;
			}
		}

		console.log("The user1Value is " + user1Value);
		console.log("The user2Value is " + user2Value);
		if(user1Value < user2Value) {
			userPoints = 0.5;
			console.log("The pair is larger than");
			return userPoints;
		}
		else if(user1Value > user2Value) {
			userPoints = 0;
			console.log("The pair is smaller than")
			return userPoints;
		}
	}
	//console.log("The value " + search + " appears " + count + " times");
	/*
	if(isPairs(user1List) == "Y") {
		console.log("Its in the function");
		for(var i = 0; i < 2; i++) {
			for(var j = 0; j < values.length; j++) {
				// Looks through the results for the values
				if(userResults.includes(values[j])) {
					userValueList[i] = keyDict[values[i]];
					console.log("The userValueList[i] is " + keyDict[values[i]]);
					continue;
				}
			}
		}

		if (userValueList[0] < userValueList[1]) {
			console.log("user1Value is less than user2Value");
			userPoints = 0.5;
		}
		else {
			console.log("It is not less");
			userPoints = 0;
		}

	}*/
	// This is good
	var List1 = user1List;
	var List2 = user2List;
	// Only works for high card/Straight/Flush/StraightFlush/RoyalFlush
	for(var i = 0; i < List1.length; i++) {
		if (List1[i] != List2[i]) {
			console.log("This is List1: " + List1[i]);
			console.log("This is List2: " + List2[i]);
			if (List1[i] < List2[i]) {
				userPoints = 0.5;
				break;
			}
			else if(List1[i] > List2[i]) {
				userPoints = 0;
				break;
			}
		}
	}

    console.log("The value at the end " + userPoints);
}

finalEvaluation([0,0,2,5,6,8,9],[1,1,2,3,5,7,8],"It is a pair of A", "It is a pair of K");
finalEvaluation([0,2,2,2,2,3,6],[1,2,4,4,4,4,7],"It is a four of a kind of Q", "It is a four of kind of 10");
finalEvaluation([3,4,6,7,7,9,10],[2,3,5,5,6,8,9],"It is a pair of 7", "It is a pair of 9");
finalEvaluation([0,1,3,5,6,8,9],[1,3,4,4,9,10,11],"High Card");
finalEvaluation([3,4,6,7,8,9,10],[0,1,3,5,6,8,9], "High card");
finalEvaluation([0,1,2,4,5,5,6],[0,1,3,4,5,5,6],"It is a pair of 9", "It is a pair of 9");

/*
function orderTesting() {
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
*/
