// Declare variables to track the sum and ace count for the dealer and player
let playerScore = 0;
let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let hidden;
let deck;
let canHit = true;

// Function to initialize the game when the "Start" button is clicked
function startClick() {
  buildDeck();
  shuffleDeck();
  startGame();
}



// Function to create a deck of cards with different values and types
function buildDeck() {
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  const types = ["C", "D", "H", "S"];
  deck = [];

  for (const type of types) {
    for (const value of values) {
      deck.push(`${value}-${type}`);
    }
  }
}

// Function to shuffle the deck randomly
function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    const j = Math.floor(Math.random() * deck.length);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Function to start the game by drawing initial cards for the dealer and player
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
  // Wis de kaarten van de dealer en de speler
  clearElement("dealer-cards");
  clearElement("your-cards");

  // Reset de scores naar nul
  dealerSum = 0;
  yourSum = 0;

  // Reset de aas tellingen naar nul
  dealerAceCount = 0;
  yourAceCount = 0;

  // Update de scores op het scherm
  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("your-sum").innerText = yourSum;

  const hiddenImg = document.createElement("img");

  let container = document.getElementById("dealer-cards");

  // Stel de eigenschappen van het img-element in
  hiddenImg.id = "hidden";
  hiddenImg.src = "./cards/BACK.png";

  // Voeg het img-element toe aan de container
  container.appendChild(hiddenImg);

  // Zet de 'hidden' kaart en kanHit variabelen terug naar hun oorspronkelijke staat
  hidden = null;
  canHit = true;
}

function clearElement(elementId) {
  const container = document.getElementById(elementId);
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

// Function to draw a card and update the sum for the specified player
function drawCard(elementId, updateSumFunction) {
  if (!canHit) {
    return;
  }

  const cardImg = document.createElement("img");
  const card = deck.pop();
  cardImg.src = `./cards/${card}.png`;
  updateSumFunction(card);
  document.getElementById(elementId).append(cardImg);

  // Check if the player has busted after drawing a card
  if (reduceAce(yourSum, yourAceCount) > 21) {
    canHit = false;
  }
}

// Event handler for the "Hit" button
function hit() {
  drawCard("your-cards", updateYourSum);
}

// Event handler for the "Stay" button
function stay() {
  // Reduce aces if necessary, reveal dealer's hidden card, determine the winner, and display results
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);

  canHit = false;

  // Controleer of 'hidden' niet null is voordat je de 'src' eigenschap instelt
  if (hidden !== null) {
    document.getElementById("hidden").src = `./cards/${hidden}.png`;
  }

  let message = determineWinner();
  displayResults(message);
}

// Function to update the dealer's sum and ace count based on the drawn card
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
    message = "You win!";
  } else if (yourSum === dealerSum) {
    message = "Tie!";
  } else if (yourSum > dealerSum) {
    message = "You Win!";
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
