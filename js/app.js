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

function initGame() {
	var deck = document.querySelector('.deck');
	var shuffledCards = shuffle(cards);
	var cardHTML = shuffledCards.map(function(card) {
		return generateCard(card);
	});
	moves = 0;
	moveCounter.innerText = moves;

	deck.innerHTML = cardHTML.join('');
}

var openCards = [];
var moves = 0;
var moveCounter = document.querySelector('.moves');

initGame();
var allCards = document.querySelectorAll('.card');

function showCard(card) {
	card.classList.add('open');
	card.classList.add('show');
}

allCards.forEach(function(card) {
	card.addEventListener('click', function(e) {

		if (!card.classList.contains('open') && !card.classList.contains('show') && openCards.length <=1) {
			openCards.push(card);
			showCard(card);

			if (openCards.length == 2) {
				// check if cards match
				// but need to make sure you can't click the same card twice and count that as a match
				if (openCards[0].dataset.card == openCards[1].dataset.card) {
					openCards[0].classList.add('match');
					showCard(openCards[0]);

					openCards[1].classList.add('match');
					showCard(openCards[1]);

					openCards = [];
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
			}
		}
	});
});
