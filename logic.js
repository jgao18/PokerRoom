/* Created by Jessie Cisneros
   Use: logic.js determines the highest value the hand contains
*/

var suits = ["heart", "spade", "diamond", "club"];
var values = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
var keyDict = {"A": 0, "K": 1, "Q": 2, "J": 3, "10": 4, "9": 5, "8": 6, "7": 7, "6": 8, "5": 9, "4": 10, "3": 11, "2": 12};

function sortNumber(a,b) {
    return a - b;
}

module.exports = {
	
	// Determines the value of the hand
	// Takes in table cards and two cards of player
	determineHand: function(cardList) {
		
		// Retrieving all variables to determine hand
		var handResult;
		handResult = isSuit(cardList);
		handResult += isOrder(cardList);
		handResult += isPairs(cardList);
		
	    // Determine by suit/order/value
		switch (winner) {
			case "YYN": 
				return whichFlush(cardList);
				break;
			case "YNY":
				return "Flush";
				break;
			case "YNN":
				return "Flush";
				break;
			case "NYY":
				return "Straight";
				break;
			case "NYN":
				return "Straight";
				break;
			case "NNY":
				return whichPair(cardList);
				break;
			case "NNN":
				return "High Card";
				break;
			default:
				console.log("Something went wrong");
				break;
		}
	},
	
	// If two players have the same result, then determine the winner between them
	finalEvaluation: function(user1Cards, user2Cards, user1Result, user2Result) {
		
		var List1 = sortCards(user1Cards);
		var List2 = sortCards(user2Cards);
	    var userPoints = 0;
		var user1Value;
		var user2Value;
		
		/* Looks for the highest pair between each player
		   Works for pair/two pair/threeokakind/FullHouse/FourofKind */
		if(isPairs(user1Cards) == "Y") {
			for(var i = 0; i < values.length; i++) {
				if(user1Result.includes(values[i])) {
					user1Value = keyDict[values[i]];
					break;
				}
			}
		
			for(var i = 0; i < values.length; i++) {
				if(user2Result.includes(values[i])) {
					user2Value = keyDict[values[i]];
					break;
				}
			}
		
			// If the first user's value is more than the second
			if(user1Value < user2Value) {
				userPoints = 0.25;
				return userPoints;
			}
			else if(user1Value > user2Value) {
				userPoints = 0;
				return userPoints;
			}
		}
		
		/* Look through each cardList and find the highest value
		   that stands apart.
		   Works for high card/Straight/Flush/StraightFlush/RoyalFlush */
		for(var i = 0; i < List1.length; i++) {
			if (List1[i] != List2[i]) {
				if (List1[i] < List2[i]) {
					userPoints = 0.25;
					break;
				}
				else if(List1[i] > List2[i]) {
					userPoints = 0;
					break;
				}
			}
		}
	
	    return userPoints;
	}
}

// Sorts a card list by highest value
function sortCards(cards) {

	var pointList = [];
	
	for (var i = 0; i < cards.length; i++) {
		pointList.push(keyDict[cards[i].get_value()]);
	}
	
	pointList.sort(sortNumber);
	
	return pointList;
}

function isSuit(cards) {
	var testList = [];
	var points = 0;
	var heart = 0;
	var spade = 0;
	var diamond = 0;
	var club = 0;
	
	// Determines if there are multiple suits
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
	
	// Determines if there are 5 cards of the same suit or more
	if((heart>4) || (spade>4) || (diamond>4) || (club>4)) {
		points = "Y";
	}
	else {
		points = "N";
	}
	
	return points;
}

function isOrder(cards) {
	var orderList = sortCards(cards);
	var order = 0;
	
	// Determines if the list has five values in order
	for (var i = 0; i < (orderList.length-1); i++) {
		if ((orderList[i] + 1) == orderList[i+1] ) {
			order++;
			if (order > 3) {
				return "Y";
			}
		}
		// If the next value the same value as current
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
	var pairs = {};
	var pairList = sortCards(cards);
	var numOfCards = 1;
	
	// Retrieve values
	for (var i = 0; i < cards.length; i++) {
		newList.push(values[pairList[i]]);
	}
	
	// Stores pairs in a dictionary
	for (var i = 0; i < (newList.length-1); i++) {
		if (newList[i] == newList[i+1]) {
			numOfCards++; 
			pairs[newList[i]] = numOfCards;
		}
		else {
			numOfCards = 1;
		}
	}
	
	// If there is a pair, return "Y"
	for (var i = 0; i < values.length; i++) {
		if( pairs[values[i]] > 1) {
			return "Y";
		}
	}
	
	return "N";
}

// Determines Royal or Straight Flush
function whichFlush(cards) {
	var flushList = sortCards(cards);
	var isRoyal = 0;
	
	// If values match the beginning values
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

// Finds the value that correspond to times
function findValue(dict,keyList,times,extra) {
	for(var i = keyList.length - 1; i => 0; i--) {
		if(dict[keyList[i]] == times && keyList[i] != extra) {
			return keyList[i];
		}
	}
}

// Determines the highest pair values
function whichPair(cards) {
	var newList = [];
	var pairs = {};
	var finalDict = {};
	var numOfCards = 1;
	var fourOfaKind = 0;
	var threeOfaKind = 0;
	var pair = 0;
	var pairList = sortCards(cards);
	var comp;
	var returnValue;
	var extraValue;
	var answer;
	
	// Find the values that are associate to the points
	for (var i = 0; i < pairList.length; i++) {
		newList.push(values[pairList[i]]);
	}
	
	for (var i = 0; i < newList.length; i++) {
		// If the next value is the current value, then skip
		if (comp == newList[i]) {
			continue;
		}
		comp = newList[i];
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
	
	if(fourOfaKind == 1) {
		returnValue = findValue(pairs,keyList,4);
		answer = "four of a kind of " + returnValue;
		return answer;
	}
	else if(threeOfaKind == 1 && pair == 1) {
		returnValue = findValue(pairs,keyList,3);
		extraValue = findValue(pairs,keyList,2);
		answer = "Full House with " + returnValue + " and " + extraValue;
		return answer;
	}
	else if(threeOfaKind == 1) {
		returnValue = findValue(pairs,keyList,3);
		answer = "three of a kind of " + returnValue;
		return answer;
	}
	else if(pair > 1) {
		returnValue = findValue(pairs,keyList,2);
		extraValue = findValue(pairs,keyList,2,returnValue);
		answer = "two pair with " + returnValue + " and " + extraValue;
		return answer;
	}
	else if(pair == 1) {
		returnValue = findValue(pairs,keyList,2);
		answer = "It is a pair of " + returnValue;
		return answer;
	}
	
}