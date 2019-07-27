/*
	Variables Module Depot
	Avoiding using Global Variables
	Instead I'm using the Revealing Module Pattern method
	https://stackoverflow.com/questions/5647258/how-to-use-revealing-module-pattern-in-javascript
*/
let vDepot = (function (){
	
	// The deck of all the cards
	const deckList = [
		"fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube",
		"fa-leaf", "fa-bicycle", "fa-bomb", "fa-diamond", "fa-paper-plane-o",
		"fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"
		];
		
	// Creating the Deck
	let deck;
	let deckShuffle;	
	
	// Places elements with the class name CARD into a list
	let selectCardsList;
	let selectCards;
	let matchCardArray = [];
	
	// This variable tracks moves taken
	const movesSpan = document.querySelector(".moves");
	let movesTaken = 0;
	let matchesGotten = 0;
	
	// Stars selector
	const stars = document.querySelectorAll(".stars")[0];
	const starsTotal = document.querySelectorAll(".stars")[1];
	
	// Timer selector
	const timer = document.querySelector(".clock");
	const timerWinning = document.querySelectorAll(".timer")[1];
	let clock;
	let timerOn = 0;
	
	// Modals for Start & End games
	const startGame = document.getElementsByClassName("startgame")[0];
	const winnerGame = document.getElementsByClassName("winner")[0];
	const noTouch = document.getElementsByClassName("noTouch")[0];
	const titleCard = document.getElementsByClassName("titlecard")[0];
	
	/* The following code is the way the game resets as well as starts */
	const playAgain = document.querySelector(".restartbutton");
	const restart = document.querySelector(".restart");
	
	// Replays the game
	playAgain.addEventListener("click", resetGame);
	
	// Restarts the game
	restart.addEventListener("click", resetGame);
	
	// Shuffle function from http://stackoverflow.com/a/2450976
	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
	
		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	};
	
	// This function will "deal" out the cards on the game board
	function layoutCards() {
		deckShuffle.forEach(function(e) {
			
			// These variables are set here to avoid only one element being created
			let cardCreate = document.createElement("li");
			let cardClassAssign = cardCreate.setAttribute("class", "card");
			let cardSymbol = document.createElement("i");
			let cardSymbolAssign = cardSymbol.setAttribute("class", "fa");
			cardCreate;
			cardClassAssign;
			deck.append(cardCreate);
			cardSymbol;
			cardSymbolAssign;
			cardSymbol.className += " " + e;
			cardCreate.append(cardSymbol);
			// once the li element with the card class is created I then add the eventListener to it
			cardCreate.addEventListener("click", flipCard, false);
		});	
	};
	
	// Card Flipping Function
	function flipCard(evt) {
		
		// Redefined variables here because the card class didn't exist in the DOM when the script first ran
		selectCardsList = document.querySelectorAll(".card");
		selectCards = Array.prototype.slice.call(selectCardsList);
		
		// Interrupts any error animations happening when you flip another card
		removeError();
		
		// Only runs once, after the first card is flipped to start timer
		if (timerOn == 0) {
			timerFunc(true, 1);
		}
		
		// Checks to make sure to run code ONLY if the card is face-down
		if (evt.target.classList.contains("open") || evt.target.classList.contains("match")) {
		} else {
			evt.target.classList.add("open", "show");
			// Checks each card & finds the opens, which have the .open class
			selectCards.forEach(function(e) {
				if (e.classList.contains("open")) {
					const checkCardsList = e.querySelectorAll(".fa");
					const checkCards = Array.prototype.slice.call(checkCardsList);
					// Checks the open cards & places them in an array to be matched
					checkCards.forEach(function(entry) {
						const matchCardsList = entry.classList;
						const matchCards = Array.prototype.slice.call(matchCardsList);
						matchCardArray.push(matchCards[1]);
					});
				}
			});
	
			/*
				The following if statements will be matching index 0 & 1 of the array
				To see whether it matches, doesn't match, or if only one card is in the array
			*/
			if (matchCardArray.length === 1) {
				resetArray();
			} else if (matchCardArray[0] == matchCardArray[1]) {
				resetArray();
				selectCards.forEach(function(e) {
					if (e.classList.contains("open")) {
						e.classList.add("match");
						e.classList.remove("open", "show");
					}
				});
				// Adds the variables to the counter
				movesTaken += 1;
				matchesGotten += 1;
				// Checks if the cards in the array don't match
			} else if (matchCardArray[0] != matchCardArray[1]) {
				resetArray();
				// Checks the cards which are opened and adds the error animation to them
				selectCards.forEach(function(e) {
					if (e.classList.contains("open")) {
						e.classList.add("error");
						e.addEventListener("webkitAnimationEnd", removeError, false);
						e.addEventListener("animationend", removeError, false);
					}
				});
				movesTaken += 1;
				// Checks the movesTaken against the starRanking()
				starRanking();
			} else {
			}
		}
		// Updates the moves taken counter
		movesTakenFunc();
		// Checks if the win conditions are satisfied
		matchedGame();
	};
	
	// This kills the error animation and flip the cards back down
	function removeError() {
		selectCards.forEach(function(e) {
			if (e.classList.contains("error")) {
				e.classList.remove("open", "show", "error");
			}
		});
	};
	
	// resets match array
	function resetArray() {
		matchCardArray.length = 0;
	};
	
	// reset the layout of the cards and shuffles the deck
	function resetLayout() {
		deck = document.getElementsByClassName("deck")[0];
		while (deck.firstChild) {
			deck.removeChild(deck.firstChild);
		}
		deckShuffle = shuffle(deckList);
	}
	
	// Adjusts moves taken
	function movesTakenFunc() {
		movesSpan.textContent = movesTaken.toString();
	};
	
	// Decreases star ranking depending on the number of moves taken
	function starRanking() {
		if (movesTaken == 14) {
			stars.children[2].style.visibility = "hidden";
			starsTotal.children[2].style.visibility = "hidden";
		} else if (movesTaken == 18) {
			stars.children[1].style.visibility = "hidden";
			starsTotal.children[1].style.visibility = "hidden";
		} else if (movesTaken == 22) {
			stars.children[0].style.visibility = "hidden";
			starsTotal.children[0].style.visibility = "hidden";
		} else if (movesTaken == 0) {
			// resets stars
			stars.children[0].style.visibility = "visible";
			stars.children[1].style.visibility = "visible";
			stars.children[2].style.visibility = "visible";
			starsTotal.children[0].style.visibility = "visible";
			starsTotal.children[1].style.visibility = "visible";
			starsTotal.children[2].style.visibility = "visible";
		}
	};
	
	// This will adjust the winning message based off the ranking
	function starMessage() {
		if (movesTaken < 15) {
			titleCard.innerHTML = "INCREDIBLE PERFORMANCE!! ALL THREE STARS!!";
		} else if (movesTaken < 19) {
			titleCard.innerHTML = "Two stars is fantastic! Great job!!";
		} else if (movesTaken < 23) {
			titleCard.innerHTML = "Awesome! Let's try for three stars!!";
		} else {
			titleCard.innerHTML = "You did it!! Congratulations!!";
		}
	};
	
	// Function timer
	function timerFunc(start, t) {
		if (start) {
			timerOn = 1;
			clock = setInterval(function() {
				timer.innerHTML = t;
				t++;
			}, 1000);
		} else {
			// This pauses the timer
			clearInterval(clock);
			// This clears the timer
			timer.innerHTML = 0;
			timerOn = 0;
		}	
	};
	
	// Checks to see if the player achieved all 8 matches
	function matchedGame() {
		if (matchesGotten == 8) {
			starRanking();
			starMessage();
			clearInterval(clock);
			timerWinning.innerHTML = timer.innerHTML + " seconds";
			// Prevents the player from touching anything but the modal
			noTouch.style.display = "flex";	
			// Pops up the modal
			winnerGame.style.display = "flex";
			matchesGotten = 0;
		} 
	};
	
	// This function resets all the variables and sets the game back to the start
	function resetGame() {
		resetLayout();
		layoutCards();
		resetArray();
		movesTaken = 0;
		movesTakenFunc();
		starRanking();
		timerFunc(false, 0);
		noTouch.style.display = "none";	
		winnerGame.style.display = "none";
	};
		
	// Returns public variables for usage
	return {
	
		// Public Variables
		deckList: deckList,
		deck: deck,
		deckShuffle: deckShuffle,
		selectCardsList: selectCardsList,
		selectCards: selectCards,
		matchCardArray: matchCardArray,
		movesSpan: movesSpan,
		movesTaken: movesTaken,
		matchesGotten: matchesGotten,
		stars: stars,
		starsTotal: starsTotal,
		timer: timer,
		timerWinning: timerWinning,
		clock: clock,
		timerOn: timerOn,
		startGame: startGame,
		winnerGame: winnerGame,
		noTouch: noTouch,
		titleCard: titleCard,
		playAgain: playAgain,
		restart: restart,
		
		// Public Functions
		shuffle: shuffle,
		layoutCards: layoutCards,
		flipCard: flipCard,
		removeError: removeError,
		resetArray: resetArray,
		resetLayout: resetLayout,
		movesTakenFunc: movesTakenFunc,
		starRanking: starRanking,
		starMessage: starMessage,
		timerFunc: timerFunc,
		matchedGame: matchedGame,
		resetGame: resetGame	
	}
}());

// Resets/Starts Game
vDepot.resetGame();