// CASINO/js/omaha_script.js

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       === VARIABLES GLOBALES Y ESTADO DEL JUEGO ===
       ============================================== */
    const playerNameDisplay = document.getElementById("playerNameDisplay");
    if (!playerNameDisplay) return;

    const PLAYER_NAME = playerNameDisplay.textContent.trim();
    const balanceEl = document.getElementById("balance");
    const potEl = document.getElementById("pot");
    const holeEl = document.getElementById("holeCards"); 
    const communityEl = document.getElementById("community");
    const betAmountInput = document.getElementById('betAmount');
    
    // Estado interno del juego (Simulación)
    let playerStack = parseInt(balanceEl.textContent) || 1000;
    let currentPot = 0;
    let minBet = 10;
    let playerSeatId = null;
    let gameActive = false; 
    let playerHand = []; 

    const SIMULATED_COMMUNITY = ['Qd', 'Jc', '3s']; 
    
    // Variables para referenciar el asiento del jugador
    let seatElement = null; 
    let seatInfoElement = null; 

    /* ==============================================
       === VARIABLES Y LÓGICA DE CARTAS ===
       ============================================== */
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
    
    /* ==============================================
       === LOBBY Y REDIRECCIÓN (Mantenido) ===
       ============================================== */
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

    /* ==============================================
       === FUNCIONES DE RENDERIZADO RÁPIDO ===
       ============================================== */

    function updateDisplay() {
        // 1. Actualiza Saldo (barra de control inferior)
        balanceEl.textContent = playerStack; 
        
        // 2. Actualiza Pozo Total
        potEl.textContent = currentPot;
        
        // 3. Actualiza Stack en el asiento (NUEVA LÓGICA)
        if (gameActive && seatInfoElement) {
            seatInfoElement.innerHTML = 
                `<strong>${PLAYER_NAME}</strong><br>Stack: $${playerStack}`;
        }
        
        // 4. Actualiza botón Call/Check
        document.getElementById('btnCheck').textContent = (currentPot > 0 && minBet > 0) ? `Call $${minBet}` : 'Check';
    }

    function renderCards(element, cards) {
    element.innerHTML = "";
    cards.forEach(card => {
        const div = document.createElement("div");
        div.classList.add("card");
        
        // Asume que la carta viene en formato "RankSuit" (ej: "A♥")
        const rank = card.substring(0, card.length - 1); // El Rank (A, K, T, 2)
        const suit = card.charAt(card.length - 1);       // El Suit (♥, ♦, ♣, ♠)

        // --- Configuración interna del DIV para apilar Rango y Palo ---
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.style.padding = '3px 0'; // Pequeño relleno para que no se pegue al borde

        // 1. Elemento para el Rango (ej: K)
        const rankEl = document.createElement("span");
        rankEl.textContent = rank;
        rankEl.style.fontSize = '1.2rem';
        rankEl.style.fontWeight = 'bold'; // Asegura que el rango se vea fuerte
        div.appendChild(rankEl);
        
        // 2. Elemento para el Palo (ej: ♥)
        const suitEl = document.createElement("span");
        suitEl.textContent = suit;
        suitEl.style.fontSize = '0.7rem';
        div.appendChild(suitEl);
        
        // 3. Aplicar color (al div padre, que se hereda a los spans)
        if (suit === '♦' || suit === '♥') {
            div.style.color = '#dc3545'; // Rojo
        } else {
            div.style.color = '#000000'; // Negro
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
            
            // Asume formato "RankSuit" (ej: "Qd", "Jc")
            const cardValue = cards[i];
            const rank = cardValue.substring(0, cardValue.length - 1); 
            // Usamos los símbolos reales de palo para el renderizado
            let suit = cardValue.charAt(cardValue.length - 1); 
            
            // Mapeo simple de letras simuladas a símbolos reales si es necesario
            if (suit === 'd') suit = '♦'; 
            else if (suit === 'c') suit = '♣'; 
            else if (suit === 'h') suit = '♥';
            else if (suit === 's') suit = '♠';

            
            // --- Configuración interna del DIV para apilar Rango y Palo ---
            div.style.display = 'flex';
            div.style.flexDirection = 'column';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            div.style.padding = '3px 0';

            // 1. Elemento para el Rango (ej: Q)
            const rankEl = document.createElement("span");
            rankEl.textContent = rank;
            rankEl.style.fontSize = '1.2rem';
            rankEl.style.fontWeight = 'bold';
            div.appendChild(rankEl);
            
            // 2. Elemento para el Palo (ej: ♦)
            const suitEl = document.createElement("span");
            suitEl.textContent = suit;
            suitEl.style.fontSize = '0.7rem';
            div.appendChild(suitEl);

            // 3. Aplicar color (Rojo si es diamante o corazón)
            if (suit === '♦' || suit === '♥') {
                div.style.color = '#dc3545'; // Rojo
            } else {
                div.style.color = '#000000'; // Negro
            }

        } else {
            // Si no hay carta (Turn o River no repartidos)
            div.classList.add("card-slot");
        }
        communityEl.appendChild(div);
    }
}


    /* ==============================================
       === MANEJO DE ASIENTO Y REPARTO (SIMULADO) ===
       ============================================== */
    const joinButtons = document.querySelectorAll('.join-btn');
    const seat1Button = document.querySelector('.join-btn[data-seat="1"]');

    if (seat1Button) {
        seat1Button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (gameActive) return;

            const seatId = e.target.dataset.seat;
            playerSeatId = seatId;
            gameActive = true;

            // Almacenar referencias al asiento del jugador local
            seatElement = document.querySelector(`.seat-${seatId}`);
            seatInfoElement = seatElement ? seatElement.querySelector('.player-info') : null;


            // 1. Ocultar todos los botones de unirse
            joinButtons.forEach(btn => btn.style.display = 'none');
            
            // 2. Ocupar visualmente el asiento 1
            if (seatElement) {
                seatElement.style.borderColor = '#ffd700';
            }
            
            // 3. Reparto de Cartas de Mano ALEATORIAS (4 cartas)
            playerHand = getNewRandomHand(); 
            renderCards(holeEl, playerHand);

            // 4. Simular Flop (3 cartas comunitarias)
            renderCommunity(SIMULATED_COMMUNITY);

            // 5. Inicializar el pozo y la ciega (simulada)
            currentPot = 20;
            playerStack -= 10; // Paga Small Blind simulado
            minBet = 10; 
            
            updateDisplay(); // Actualiza ambos saldos (barra inferior y stack del asiento)
            alert(`¡Te uniste al Asiento 1! Tu mano: ${playerHand.join(', ')}`);
        });
    }

    /* ==============================================
       === ACCIONES DE JUGADOR (Simulado) ===
       ============================================== */

    document.getElementById('btnFold').onclick = () => {
        if (!gameActive) return;
        alert("Fold: Has abandonado la mano.");
        gameActive = false;
        holeEl.innerHTML = "<div>Folded</div>";
    };

    document.getElementById('btnCheck').onclick = () => {
        if (!gameActive) return;

        if (minBet > 0) {
            // Call
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
            // Check
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


    /* ==============================================
       === INICIALIZACIÓN (Mantenido) ===
       ============================================== */
    updateDisplay(); 

});