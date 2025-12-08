document.addEventListener('DOMContentLoaded', () => {

    const playerNameDisplay = document.getElementById("playerNameDisplay");
    if (!playerNameDisplay) return;

    const PLAYER_NAME = playerNameDisplay.textContent.trim();
    const balanceEl = document.getElementById("balance");
    const potEl = document.getElementById("pot");
    const holeEl = document.getElementById("holeCards"); 
    const communityEl = document.getElementById("community");
    const betAmountInput = document.getElementById('betAmount');
    
    let playerStack = parseInt(balanceEl.textContent) || 1000;
    let currentPot = 0;
    let minBet = 10;
    let playerSeatId = null;
    let gameActive = false; 
    let playerHand = []; 

    const SIMULATED_COMMUNITY = ['Qd', 'Jc', '3s']; 
    
    let seatElement = null; 
    let seatInfoElement = null; 

    const suits = ['♥', '♦', '♣', '♠'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

    function createDeck() {
        let deck = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push(rank + suit); 
            }
        }
        return deck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    function dealHand(deck, numCards = 4) {
        return deck.splice(0, numCards); 
    }

    function getNewRandomHand() {
        let deck = createDeck();
        deck = shuffleDeck(deck);
        return dealHand(deck, 4); 
    }
    
    const joinBtnLobby = document.getElementById('joinBtn');
    if (joinBtnLobby) {
        joinBtnLobby.addEventListener('click', () => {
            const name = document.getElementById('playerName').value.trim();
            if (name === "") {
                alert("Ingresa un nombre");
                return;
            }
            window.location = `omaha_table.php?usuarios=${encodeURIComponent(name)}`;
        });
    }

    function updateDisplay() {
        balanceEl.textContent = playerStack; 
        
        potEl.textContent = currentPot;
        
        if (gameActive && seatInfoElement) {
            seatInfoElement.innerHTML = 
                `<strong>${PLAYER_NAME}</strong><br>Stack: $${playerStack}`;
        }
        
        document.getElementById('btnCheck').textContent = (currentPot > 0 && minBet > 0) ? `Call $${minBet}` : 'Check';
    }

    function renderCards(element, cards) {
    element.innerHTML = "";
    cards.forEach(card => {
        const div = document.createElement("div");
        div.classList.add("card");
        
        const rank = card.substring(0, card.length - 1); 
        const suit = card.charAt(card.length - 1); 

        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.style.padding = '3px 0'; 

        const rankEl = document.createElement("span");
        rankEl.textContent = rank;
        rankEl.style.fontSize = '1.2rem';
        rankEl.style.fontWeight = 'bold'; 
        div.appendChild(rankEl);
        
        const suitEl = document.createElement("span");
        suitEl.textContent = suit;
        suitEl.style.fontSize = '0.7rem';
        div.appendChild(suitEl);
        
        if (suit === '♦' || suit === '♥') {
            div.style.color = '#dc3545'; 
        } else {
            div.style.color = '#000000'; 
        }

        element.appendChild(div);
    });
}

    function renderCommunity(cards) {
    communityEl.innerHTML = "";
    const maxCards = 5;
    
    for (let i = 0; i < maxCards; i++) {
        const div = document.createElement("div");
        
        if (cards[i]) {
            div.classList.add("card");
            
            const cardValue = cards[i];
            const rank = cardValue.substring(0, cardValue.length - 1); 
            let suit = cardValue.charAt(cardValue.length - 1); 
            
            if (suit === 'd') suit = '♦'; 
            else if (suit === 'c') suit = '♣'; 
            else if (suit === 'h') suit = '♥';
            else if (suit === 's') suit = '♠';

            
            div.style.display = 'flex';
            div.style.flexDirection = 'column';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            div.style.padding = '3px 0';

            const rankEl = document.createElement("span");
            rankEl.textContent = rank;
            rankEl.style.fontSize = '1.2rem';
            rankEl.style.fontWeight = 'bold';
            div.appendChild(rankEl);
            
            const suitEl = document.createElement("span");
            suitEl.textContent = suit;
            suitEl.style.fontSize = '0.7rem';
            div.appendChild(suitEl);

            if (suit === '♦' || suit === '♥') {
                div.style.color = '#dc3545'; 
            } else {
                div.style.color = '#000000'; 
            }

        } else {
            div.classList.add("card-slot");
        }
        communityEl.appendChild(div);
    }
}


    const joinButtons = document.querySelectorAll('.join-btn');
    const seat1Button = document.querySelector('.join-btn[data-seat="1"]');

    if (seat1Button) {
        seat1Button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (gameActive) return;

            const seatId = e.target.dataset.seat;
            playerSeatId = seatId;
            gameActive = true;

            seatElement = document.querySelector(`.seat-${seatId}`);
            seatInfoElement = seatElement ? seatElement.querySelector('.player-info') : null;


            joinButtons.forEach(btn => btn.style.display = 'none');
            
            if (seatElement) {
                seatElement.style.borderColor = '#ffd700';
            }
            
            playerHand = getNewRandomHand(); 
            renderCards(holeEl, playerHand);

            renderCommunity(SIMULATED_COMMUNITY);

            currentPot = 20;
            playerStack -= 10; 
            minBet = 10; 
            
            updateDisplay(); 
            alert(`¡Te uniste al Asiento 1! Tu mano: ${playerHand.join(', ')}`);
        });
    }

    document.getElementById('btnFold').onclick = () => {
        if (!gameActive) return;
        alert("Fold: Has abandonado la mano.");
        gameActive = false;
        holeEl.innerHTML = "<div>Folded</div>";
    };

    document.getElementById('btnCheck').onclick = () => {
        if (!gameActive) return;

        if (minBet > 0) {
            
            const callAmount = minBet;
            if (playerStack >= callAmount) {
                playerStack -= callAmount;
                currentPot += callAmount;
                minBet = 0; 
                alert(`Call: Pagaste $${callAmount}.`);
            } else {
                alert("No tienes suficiente dinero para Call.");
            }
        } else {
            
            alert("Check: Pasaste la acción.");
        }
        updateDisplay(); 
    };

    document.getElementById('btnBet').onclick = () => {
        if (!gameActive) return;
        
        let betAmount = Number(betAmountInput.value) || 0;
        
        if (betAmount <= 0) {
            alert("Ingresa una cantidad válida.");
            return;
        }

        if (playerStack >= betAmount) {
            playerStack -= betAmount;
            currentPot += betAmount;
            minBet = betAmount; 
            alert(`Bet/Raise: Apostaste $${betAmount}.`);
        } else {
            alert("No tienes suficiente dinero para esa apuesta.");
        }
        updateDisplay(); 
    };


    updateDisplay(); 

});