const emojis = ['🍎', '🌈', '🍇', '🍉', '⭐', '🍓', '🍍', '🥝'];
const cardsArray = [...emojis, ...emojis];
let flippedCards = [];
let matchedCards = 0;
let currentPlayer = 0;
let mode = 'solo';
let players = ['Player'];
let scores = [0, 0];

const board = document.getElementById('game-board');
const scoreboard = document.getElementById('scoreboard');
const winMessage = document.getElementById('win-message');

function showFriendForm() {
  document.getElementById('friend-form').style.display = 'block';
}

function startGame(selectedMode) {
  mode = selectedMode;
  if (mode === 'duo') {
    const p1 = document.getElementById('player1').value || 'Player 1';
    const p2 = document.getElementById('player2').value || 'Player 2';
    players = [p1, p2];
    scores = [0, 0];
  }
  document.getElementById('setup').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  initBoard();
  updateScoreboard();
}

function initBoard() {
  board.innerHTML = '';
  cardsArray.sort(() => 0.5 - Math.random());

  cardsArray.forEach((emoji) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;

    card.addEventListener('click', () => {
      if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        card.textContent = emoji;
        flippedCards.push(card);

        if (flippedCards.length === 2) {
          checkMatch();
        }
      }
    });

    board.appendChild(card);
  });
}

function checkMatch() {
  const [first, second] = flippedCards;

  if (first.dataset.emoji === second.dataset.emoji) {
    matchedCards += 2;
    scores[currentPlayer] += 10;
    flippedCards = [];
    updateScoreboard();

    if (matchedCards === cardsArray.length) {
      setTimeout(() => {
        winMessage.textContent = mode === 'duo'
          ? `🎉 Game Over! ${players[0]}: ${scores[0]} pts | ${players[1]}: ${scores[1]} pts`
          : `🎉 You matched all cards! Score: ${scores[0]} pts`;
      }, 300);
    }
  } else {
    setTimeout(() => {
      first.classList.remove('flipped');
      second.classList.remove('flipped');
      first.textContent = '';
      second.textContent = '';
      flippedCards = [];
      if (mode === 'duo') currentPlayer = 1 - currentPlayer;
      updateScoreboard();
    }, 800);
  }
}

function updateScoreboard() {
  if (mode === 'duo') {
    scoreboard.innerHTML = `${players[0]}: ${scores[0]} pts | ${players[1]}: ${scores[1]} pts<br><strong>Current Turn:</strong> ${players[currentPlayer]}`;
  } else {
    scoreboard.textContent = `Points: ${scores[0]}`;
  }
}
