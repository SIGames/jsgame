const dealerHand = document.getElementById('dealer-hand');
const playerHand = document.getElementById('player-hand');
const dealerTotal = document.getElementById('dealer-total');
const yourTotal = document.getElementById('your-total');

function startGame() {

    dealerHand.innerHTML = '';
    playerHand.innerHTML = '';

    dealCard(dealerHand);
    dealCard(playerHand);
    dealCard(dealerHand);
    dealCard(playerHand);

    updateTotal(dealerHand, dealerTotal);
    updateTotal(playerHand, yourTotal);
}

function dealCard(hand) {
    const card = document.createElement('img');
    card.classList.add('card');
    card.src = getRandomCard();
    hand.appendChild(card);
}

function getRandomCard() {
    const cardImages = [
        'cards/2-C.png', 'cards/2-D.png', 'cards/2-H.png', 'cards/2-S.png',
        'cards/3-C.png', 'cards/3-D.png', 'cards/3-H.png', 'cards/3-S.png',
        'cards/4-C.png', 'cards/4-D.png', 'cards/4-H.png', 'cards/4-S.png',
        'cards/5-C.png', 'cards/5-D.png', 'cards/5-H.png', 'cards/5-S.png',
        'cards/6-C.png', 'cards/6-D.png', 'cards/6-H.png', 'cards/6-S.png',
        'cards/7-C.png', 'cards/7-D.png', 'cards/7-H.png', 'cards/7-S.png',
        'cards/8-C.png', 'cards/8-D.png', 'cards/8-H.png', 'cards/8-S.png',
        'cards/9-C.png', 'cards/9-D.png', 'cards/9-H.png', 'cards/9-S.png',
        'cards/10-C.png', 'cards/10-D.png', 'cards/10-H.png', 'cards/10-S.png',
        'cards/A-C.png', 'cards/A-D.png', 'cards/A-H.png', 'cards/A-S.png',
        'cards/J-C.png', 'cards/J-D.png', 'cards/J-H.png', 'cards/J-S.png',
        'cards/K-C.png', 'cards/K-D.png', 'cards/K-H.png', 'cards/K-S.png',
        'cards/Q-C.png', 'cards/Q-D.png', 'cards/Q-H.png', 'cards/Q-S.png',
    ];
    const randomIndex = Math.floor(Math.random() * cardImages.length);
    return cardImages[randomIndex];
}

function updateTotal(hand, totalElement) {

    const total = calculateTotal(hand);
    totalElement.textContent = total;
}

function calculateTotal(hand) {
    // Replace this with logic to calculate the total value of the cards in the hand
    // For simplicity, I'm returning a random number between 15 and 21
    return Math.floor(Math.random() * 7) + 15;
}
