let playerScore = 0;
let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let hidden;
let deck;
let canHit = true;

// Initialize player's name and wins from the cookie
let playerName = getCookie("playerName") || "Player";
let playerWins = parseInt(getCookie("playerWins")) || 0;

window.onload = function() {
  // Prompt for a username only if it doesn't exist
  if (!getCookie("playerName")) {
    playerName = prompt("Please enter your username:", playerName);
    setCookie("playerName", playerName, 30);
  }

  // Display the initial wins
  document.getElementById("player-wins").innerText = `Totale wins: ${playerWins}`;
  document.getElementById("player-name").innerText = playerName;

  startClick();
};

function startClick() {
  buildDeck();
  shuffleDeck();
  startGame();
}

function buildDeck() {
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const types = ["C", "D", "H", "S"];
  deck = [];

  for (const type of types) {
    for (const value of values) {
      deck.push(`${value}-${type}`);
    }
  }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    const j = Math.floor(Math.random() * deck.length);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function startGame() {
  clearBoard();

  hidden = deck.pop();
  updateDealerSum(hidden);

  // Laat de dealer kaarten trekken zolang de som minder dan 17 is
  while (dealerSum < 17) {
    drawCard("dealer-cards", updateDealerSum);
  }

  for (let i = 0; i < 2; i++) {
    drawCard("your-cards", updateYourSum);
  }

  // Attach event listeners for the "Hit" and "Stay" buttons
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
}

function clearBoard() {
  clearElement("dealer-cards");
  clearElement("your-cards");

  dealerSum = 0;
  yourSum = 0;
  dealerAceCount = 0;
  yourAceCount = 0;

  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("your-sum").innerText = yourSum;

  const hiddenImg = document.createElement("img");

  let container = document.getElementById("dealer-cards");

  hiddenImg.id = "hidden";
  hiddenImg.src = "./cards/BACK.png";

  container.appendChild(hiddenImg);

  hidden = null;
  canHit = true;
}

function clearElement(elementId) {
  const container = document.getElementById(elementId);
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function drawCard(elementId, updateSumFunction) {
  if (!canHit) {
    return;
  }

  const cardImg = document.createElement("img");
  const card = deck.pop();
  cardImg.src = `./cards/${card}.png`;
  updateSumFunction(card);
  document.getElementById(elementId).append(cardImg);

  if (reduceAce(yourSum, yourAceCount) > 21) {
    canHit = false;
    endGame();
  }
}

function hit() {
  drawCard("your-cards", updateYourSum);
}

function stay() {
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);

  canHit = false;

  if (hidden !== null) {
    document.getElementById("hidden").src = `./cards/${hidden}.png`;
  }

  endGame();
}

function updateDealerSum(card) {
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);
}

// Function to update the player's sum and ace count based on the drawn card
function updateYourSum(card) {
  yourSum += getValue(card);
  yourAceCount += checkAce(card);
}

// Function to determine the winner of the game
function determineWinner() {
  let message = "";
  if (yourSum > 21) {
    message = "You Lose!";
  } else if (dealerSum > 21) {
    message = "Win!";
  } else if (yourSum === dealerSum) {
    message = "Tie!";
  } else if (yourSum > dealerSum) {
    message = "Win!";
  } else {
    message = "You Lose!";
  }
  return message;
}

// Function to display the final results on the page
function displayResults(message) {
  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("your-sum").innerText = yourSum;
  document.getElementById("results").innerText = message;
}

// Function to get the numerical value of a card
function getValue(card) {
  const value = card.split("-")[0];
  return isNaN(value) ? (value === "A" ? 11 : 10) : parseInt(value);
}

// Function to check if a card is an Ace and return the corresponding value
function checkAce(card) {
  return card[0] === "A" ? 1 : 0;
}

// Function to reduce the sum by 10 if the player has a busting hand with an Ace
function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}

function endGame() {
  let message = determineWinner();

  // Update player's wins
  if (message === "Win!") {
    playerWins++;
    setCookie("playerWins", playerWins, 30);
    document.getElementById("player-wins").innerText = `Totale wins: ${playerWins}`;
  }

  // Update the DOM with player's name and wins
  document.getElementById("player-name").innerText = playerName;

  displayResults(message);
}




// Rest of your existing functions...

// Helper function to get a cookie by name
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    if (cookie[0] === name) {
      return cookie[1];
    }
  }
  return null;
}

// Helper function to set a cookie
function setCookie(name, value, days) {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + expirationDate.toUTCString();
  document.cookie = name + "=" + value + "; " + expires + "; path=/";
}
