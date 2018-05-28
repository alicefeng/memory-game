/* code credits from the live webinar with Mike Wales */

let openCards = [];
let moves, matches, timeElapsed;
const moveCounter = document.querySelector('.moves');
const resetButton = document.querySelector('.restart');
const starHTML = '<li><i class="fa fa-star"></i></li>';
const starCounter = document.querySelector('.stars');
const timer = document.querySelector('.timer');
let newTime;
const congratsPopup = document.querySelector('.congrats_popup');
const finalStars = document.querySelector('.final_stars');
const finalMoves = document.querySelector('.final_moves');
const finalTime = document.querySelector('.final_time');
const playAgainButton = document.querySelector('.play_again');

const cards = ['fa-diamond', 'fa-diamond',
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

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

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

function removeStar() {
	let numStars = starCounter.childElementCount;

	// if player already has no stars left, don't keep trying to remove more
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

    let hours = Math.floor(timeElapsed/(60*60*1000));
    let minutes = Math.floor((timeElapsed - (hours*60*60*1000))/(60*1000));
    let seconds = Math.floor((timeElapsed - (hours*60*60*1000) - (minutes*60*1000))/1000);

    timer.innerHTML = `${hours}`.padStart(2, '0') + ':' + `${minutes}`.padStart(2, '0') + ':' + `${seconds}`.padStart(2, '0');
}

// populate final popup with stats (stars left, total moves, total time)
function makeCongratsPopup() {
	finalStars.innerText = starCounter.childElementCount;
	finalMoves.innerText = moves;
	finalTime.innerText = timer.innerText;

	congratsPopup.classList.add('won');
}

function playGame() {
	const allCards = document.querySelectorAll('.card');

	allCards.forEach(function(card) {
		card.addEventListener('click', function(e) {

			// only show cards that aren't already flipped and if there aren't already 2 cards showing
			if (!card.classList.contains('open') && !card.classList.contains('show') && openCards.length <=1) {
				openCards.push(card);
				showCard(card);

				if (openCards.length == 2) {
					// check if cards match
					if (openCards[0].dataset.card == openCards[1].dataset.card) {
						openCards[0].classList.add('match', 'animated', 'pulse');
						showCard(openCards[0]);

						openCards[1].classList.add('match', 'animated', 'pulse');
						showCard(openCards[1]);

						// empty array of open cards after match so use can click on more cards
						openCards = [];
						matches += 1;
					}

					else {
						// if no match, cards should flip back with a slight delay
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

// initialize game by setting board and resetting all counters
function initGame() {
	const deck = document.querySelector('.deck');
	let shuffledCards = shuffle(cards);
	let cardHTML = shuffledCards.map(function(card) {
		return generateCard(card);
	});
	deck.innerHTML = cardHTML.join('');

	moves = 0;
	moveCounter.innerText = moves;

	timeElapsed = 0;
	timer.innerText = '00:00:00';

	matches = 0;

	resetStars(3);

	playGame();
}

initGame();
newTime = setInterval(getNewTime, 1000);

// reset game when reset button is clicked
resetButton.addEventListener('click', function(e) {
	initGame();

})

// start new game when player reaches end
playAgainButton.addEventListener('click', function(e) {
	initGame();
	newTime = setInterval(getNewTime, 1000);
	congratsPopup.classList.remove('won');
})