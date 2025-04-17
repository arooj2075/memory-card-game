
const emojis = ["🍓", "🌈", "🍕", "🐱", "🌸", "⭐", "🎈", "🧸"];
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let soloMode = true;
let currentPlayer = 1;
let scores = {1: 0, 2: 0};

function shuffle(array) {
  return array.concat(array).sort(() => 0.5 - Math.random());
}

function createBoard() {
  const board = document.getElementById('gameBoard');
  board.innerHTML = '';
  cards = shuffle(emojis);
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function startSoloGame() {
  soloMode = true;
  document.querySelector('.mode-selection').style.display = 'none';
  document.querySelector('.scoreboard').style.display = 'block';
  updateScores();
  createBoard();
}

function showMultiplayerInput() {
  document.getElementById('playerNames').style.display = 'block';
  document.querySelector('.mode-selection').style.display = 'none';
}

function startMultiplayerGame() {
  soloMode = false;
  scores[1] = 0;
  scores[2] = 0;
  currentPlayer = 1;
  document.querySelector('.scoreboard').style.display = 'block';
  updateScores();
  createBoard();
  document.getElementById('playerNames').style.display = 'none';
}

function flipCard() {
  if (lockBoard || this.classList.contains('flipped')) return;
  this.classList.add('flipped');
  this.textContent = this.dataset.emoji;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
  if (isMatch) {
    updateScore();
    disableCards();
  } else {
    unflipCards();
    if (!soloMode) switchTurn();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
  checkGameEnd();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    firstCard.textContent = '';
    secondCard.textContent = '';
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function updateScore() {
  scores[currentPlayer] += 1;
  updateScores();
}

function updateScores() {
  const scoreText = soloMode
    ? `Score: ${scores[1]}`
    : `${getPlayerName(1)}: ${scores[1]} | ${getPlayerName(2)}: ${scores[2]} (Turn: ${getPlayerName(currentPlayer)})`;
  document.getElementById('scores').textContent = scoreText;
}

function switchTurn() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateScores();
}

function getPlayerName(num) {
  const input = document.getElementById('player' + num);
  return input ? input.value || 'Player ' + num : 'Player ' + num;
}

function checkGameEnd() {
  const flippedCards = document.querySelectorAll('.card.flipped').length;
  if (flippedCards === emojis.length * 2) {
    let message;
    if (soloMode) {
      message = `🎉 You finished the game! Score: ${scores[1]}`;
    } else {
      if (scores[1] > scores[2]) message = `🏆 ${getPlayerName(1)} wins!`;
      else if (scores[2] > scores[1]) message = `🏆 ${getPlayerName(2)} wins!`;
      else message = `🤝 It's a tie!`;
    }
    document.getElementById('winnerMessage').textContent = message;
  }
}
