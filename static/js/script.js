let blackjackGame = {
	you: {
		scoreSpan: '#your-blackjack-score',
		div: '#your-box',
		score: 0,
	},
	dealer: {
		scoreSpan: '#dealer-blackjack-score',
		div: '#dealer-box',
		score: 0,
	},
	cards: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
	cardsMap: { 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 10, Q: 10, K: 10, A: [1, 11] },
	wins: 0,
	losses: 0,
	draws: 0,
	isStand: false,
	turnsOver: false,
};

const YOU = blackjackGame.you;
const DEALER = blackjackGame.dealer;

const hitSound = new Audio('static/sounds/hit.m4a');
const winSound = new Audio('static/sounds/win.mp3');
const lostSound = new Audio('static/sounds/lost.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);
document.querySelector('#blackjack-stand-button').addEventListener('click', blackjackStand);

function blackjackHit() {
	if (!blackjackGame.isStand) {
		if (YOU.score > 21) {
			blackjackGame.turnsOver = true;
			showResult(computeWinner());
			return;
		}
		let card = randomCard();
		showCard(YOU, card);
		updateScore(YOU, card);
		showScore(YOU);
	}
}

function blackjackStand() {
	if (YOU.score > 0) {
		dealerLogic();
	}
}

function blackjackDeal() {
	if (blackjackGame.turnsOver) {
		blackjackGame.isStand = false;

		let yourImages = document.querySelector('#your-box').querySelectorAll('img');
		let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
		if (yourImages[1]) {
			for (let i = 1; i < yourImages.length; i++) {
				yourImages[i].remove();
			}
		}
		if (dealerImages[1]) {
			for (let i = 1; i < dealerImages.length; i++) {
				dealerImages[i].remove();
			}
		}
		YOU.score = 0;
		DEALER.score = 0;

		document.querySelector('#your-blackjack-score').textContent = 0;
		document.querySelector('#dealer-blackjack-score').textContent = 0;
		document.querySelector('#your-blackjack-score').style.color = '#ffffff';
		document.querySelector('#dealer-blackjack-score').style.color = '#ffffff';
		document.querySelector('#blackjack-score').textContent = "Let's Play";
		document.querySelector('#blackjack-score').style.color = 'black';

		blackjackGame.turnsOver = false;
	}
}

function randomCard() {
	let randomIndex = Math.floor(Math.random() * 13);
	return blackjackGame.cards[randomIndex];
}

function showCard(activePlayer, chosenCard) {
	if (activePlayer.score <= 21) {
		let cardImage = document.createElement('img');
		cardImage.src = `static/images/cards/${chosenCard}.png`;
		document.querySelector(activePlayer.div).appendChild(cardImage);
		hitSound.play();
	}
}

function showScore(activePlayer) {
	if (activePlayer.score > 21) {
		document.querySelector(activePlayer.scoreSpan).textContent = 'BUSTED!!';
		document.querySelector(activePlayer.scoreSpan).style.color = 'red';
	} else {
		document.querySelector(activePlayer.scoreSpan).textContent = activePlayer.score;
		document.querySelector(activePlayer.scoreSpan).style.color = '#7CFC00';
	}
}

function updateScore(activePlayer, card) {
	if (card === 'A') {
		if (activePlayer.score + blackjackGame.cardsMap[card][1] <= 21) {
			activePlayer.score += blackjackGame.cardsMap[card][1];
		} else {
			activePlayer.score += blackjackGame.cardsMap[card][0];
		}
	} else {
		activePlayer.score += blackjackGame.cardsMap[card];
	}
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dealerLogic() {
	blackjackGame.isStand = true;

	while (DEALER.score < 16 && blackjackGame.isStand) {
		let card = randomCard();
		showCard(DEALER, card);
		updateScore(DEALER, card);
		showScore(DEALER);
		await sleep(500);
	}

	if (DEALER.score > 15) {
		blackjackGame.turnsOver = true;
		showResult(computeWinner());
	}
}

function computeWinner() {
	let result;
	if (YOU.score <= 21) {
		if (YOU.score > DEALER.score || DEALER.score > 21) {
			blackjackGame.wins++;
			result = 'WON';
		} else if (YOU.score < DEALER.score || YOU.score > 21) {
			blackjackGame.losses++;
			result = 'LOST';
		} else if (YOU.score === DEALER.score) {
			blackjackGame.draws++;
			result = 'DRAW';
		}
	} else if (YOU.score > 21 && DEALER.score <= 21) {
		result = 'LOST';
	} else if (YOU.score > 21 && DEALER.score > 21) {
		result = 'DRAW';
	}
	return result;
}

function showResult(result) {
	let message, messageColor;

	if (blackjackGame.turnsOver) {
		if (result === 'WON') {
			document.querySelector('#wins').textContent = blackjackGame.wins;
			message = 'WON!!';
			messageColor = 'green';
			winSound.play();
		} else if (result === 'LOST') {
			document.querySelector('#losses').textContent = blackjackGame.losses;
			message = 'LOST!!';
			messageColor = 'red';
			lostSound.play();
		} else if (result === 'DRAW') {
			document.querySelector('#draws').textContent = blackjackGame.draws;
			message = 'DRAW!!';
			messageColor = 'black';
		} else {
			message = "Let's Play";
			messageColor = 'black';
		}
		document.querySelector('#blackjack-score').textContent = message;
		document.querySelector('#blackjack-score').style.color = messageColor;
	}
}
