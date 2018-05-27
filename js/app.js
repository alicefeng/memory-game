/*
 * Create a list that holds all of your cards
 */
var cards = ['fa-diamond', 'fa-diamond',
			 'fa-paper-plane-o', 'fa-paper-plane-o',
			 'fa-anchor', 'fa-anchor',
			 'fa-bolt', 'fa-bolt',
			 'fa-cube', 'fa-cube',
			 'fa-leaf', 'fa-leaf',
			 'fa-bicycle', 'fa-bicycle',
			 'fa-bomb', 'fa-bomb'];

function generateCard(card) {
	return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
}

function showCard(card) {
	card.classList.add('open', 'show');
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// initialize game by setting board and resetting all counters
function initGame() {
	var deck = document.querySelector('.deck');
	var shuffledCards = shuffle(cards);
	var cardHTML = shuffledCards.map(function(card) {
		return generateCard(card);
	});
	deck.innerHTML = cardHTML.join('');

	moves = 0;
	moveCounter.innerText = moves;

	timeElapsed = 0;
	timer.innerText = "00:00:00";
	// newTime = setInterval(getNewTime, 1000);

	matches = 0;

	resetStars(3);
}

function playGame() {
	var allCards = document.querySelectorAll('.card');

	allCards.forEach(function(card) {
		card.addEventListener('click', function(e) {

			if (!card.classList.contains('open') && !card.classList.contains('show') && openCards.length <=1) {
				openCards.push(card);
				showCard(card);

				if (openCards.length == 2) {
					// check if cards match
					if (openCards[0].dataset.card == openCards[1].dataset.card) {
						openCards[0].classList.add('match');
						showCard(openCards[0]);

						openCards[1].classList.add('match');
						showCard(openCards[1]);

						openCards = [];
						matches += 1;
					}

					else {
						// if no match, cards should flip back
						setTimeout(function() {
							openCards.forEach(function(card) {
								card.classList.remove('open', 'show');
							});

							openCards = [];
						}, 1000);
					}

					moves += 1;
					moveCounter.innerText = moves;

					// remove one star every 10 moves
					if(moves % 10 === 0) {
						removeStar();
					}

					// show congrats modal when game is over
					if(matches === cards.length/2) {
						clearInterval(newTime);
						makeCongratsPopup();
					}
				}
			}
		});
	});
}

var openCards = [];
var moves;
var moveCounter = document.querySelector('.moves');
var matches;
var resetButton = document.querySelector('.restart');
var starHTML = '<li><i class="fa fa-star"></i></li>';
var starCounter = document.querySelector('.stars');
var timer = document.querySelector('.timer');
var timeElapsed;
var newTime;
var congratsPopup = document.querySelector('.congrats_popup');
var finalStars = document.querySelector('.final_stars');
var finalMoves = document.querySelector('.final_moves');
var finalTime = document.querySelector('.final_time');
var playAgainButton = document.querySelector('.play_again');

initGame();
playGame();
newTime = setInterval(getNewTime, 1000);

// reset game when reset button is clicked
resetButton.addEventListener('click', function(e) {
	initGame();
	playGame();
})

// start new game when player reaches end
playAgainButton.addEventListener('click', function(e) {
	initGame();
	playGame();
	newTime = setInterval(getNewTime, 1000);
	congratsPopup.classList.remove('won');
})

// function to remove star
function removeStar() {
	var numStars = starCounter.childElementCount;

	if(numStars > 0) {
		starCounter.removeChild(starCounter.firstElementChild);
	}
}

// reset stars upon a new game
function resetStars(totalStars) {
	starCounter.innerHTML = starHTML.repeat(totalStars);
}

// increments time and parses it for display
function getNewTime() {
    timeElapsed += 1000;

    var hours = Math.floor(timeElapsed/(60*60*1000));
    var minutes = Math.floor((timeElapsed - (hours*60*60*1000))/(60*1000));
    var seconds = Math.floor((timeElapsed - (hours*60*60*1000) - (minutes*60*1000))/1000);

    timer.innerHTML = `${hours}`.padStart(2, "0") + ":" + `${minutes}`.padStart(2, "0") + ":" + `${seconds}`.padStart(2, "0");
}

// populate final popup with stats
function makeCongratsPopup() {
	finalStars.innerText = starCounter.childElementCount;
	finalMoves.innerText = moves;
	finalTime.innerText = timer.innerText;

	congratsPopup.classList.add('won');
}