// Mazos: combinamos palos y valores
const palos = ['♥','♦','♣','♠'];
const valores = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

let mazo = [];

// Crear las 52 cartas
for (let palo of palos) {
    for (let valor of valores) {
        mazo.push({valor, palo});
    }
}

// Mezclar mazo
function mezclarMazo(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

mezclarMazo(mazo);

// Jugadores
const jugadores = [
    {id: 'p1', cartas: [], activo: false},
    {id: 'p2', cartas: [], activo: false},
    {id: 'p3', cartas: [], activo: false},
    {id: 'p4', cartas: [], activo: false},
    {id: 'p5', cartas: [], activo: false}
];

// Mostrar cartas en pantalla
function mostrarCartas() {
    for (let j of jugadores) {
        const handDiv = document.querySelector(`#${j.id} .hand`);
        handDiv.innerHTML = ''; // limpiar mano actual

        for (let carta of j.cartas) {
            const card = document.createElement('div');
            card.classList.add('card-slot');

            if (carta.palo === '♥' || carta.palo === '♦') {
                card.classList.add('red');
            } else {
                card.classList.add('black');
            }

            if (j.activo) {
                card.textContent = `${carta.valor}${carta.palo}`;
            }

            handDiv.appendChild(card);
        }
    }
}

// Animar una carta desde el dealer al jugador
function animarCarta(jugadorIndex, carta) {
    const jugador = document.getElementById(jugadores[jugadorIndex].id);
    const hand = jugador.querySelector('.hand');

    // Crear div animado
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card-anim');
    document.body.appendChild(cardDiv);

    // Posición final
    const handRect = hand.getBoundingClientRect();
    const finalX = handRect.left + handRect.width / 2 - 30;
    const finalY = handRect.top + handRect.height / 2 - 42;

    setTimeout(() => {
        cardDiv.style.left = finalX + 'px';
        cardDiv.style.top = finalY + 'px';
    }, 50);

    // Al terminar animación
    cardDiv.addEventListener('transitionend', () => {
        cardDiv.remove();

        // Limpiar la mano antes de agregar nuevas cartas
        hand.innerHTML = '';

        // Solo mostrar las cartas actuales del jugador
        jugadores[jugadorIndex].cartas.forEach(c => {
            const slot = document.createElement('div');
            slot.classList.add('card-slot');
            slot.textContent = `${c.valor}${c.palo}`;
            if (c.palo === '♥' || c.palo === '♦') slot.classList.add('red');
            else slot.classList.add('black');
            hand.appendChild(slot);
        });
    });
}

function repartirConAnimacionActivos() {
    const dealer = document.getElementById('dealer-video');
    dealer.classList.add('active');
    dealer.currentTime = 0;
    dealer.play();

    // Filtrar solo jugadores activos
    const jugadoresActivos = jugadores.filter(j => j.activo);

    // LIMPIAR cartas previas de jugadores activos
    jugadoresActivos.forEach(j => {
        j.cartas = []; // Reinicia array de cartas
        const handDiv = document.querySelector(`#${j.id} .hand`);
        handDiv.innerHTML = ''; // Limpia slots visuales
    });

    let delay = 0;

    // Repartir exactamente 2 cartas por jugador activo
    for (let round = 0; round < 2; round++) {
        jugadoresActivos.forEach((j) => {
            const index = jugadores.indexOf(j);

            const carta = mazo.pop(); // tomar del mazo
            j.cartas.push(carta);     // agregar al array del jugador

            setTimeout(() => {
                animarCarta(index, carta);
            }, delay);

            delay += 300;
        });
    }

    // Detener video dealer después del reparto
    setTimeout(() => {
        dealer.classList.remove('active');
    }, delay + 500);
}



// Configurar botones "Unirme"
document.querySelectorAll('.join-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
        const jugador = jugadores[i];

        // Activar jugador
        jugador.activo = true;
        btn.style.display = 'none';

        // Limpiar solo su mano
        jugador.cartas = [];
        const handDiv = document.querySelector(`#${jugador.id} .hand`);
        handDiv.innerHTML = '';

        // Repartir 2 cartas solo a este jugador
        for (let j = 0; j < 2; j++) {
            const carta = mazo.pop();
            jugador.cartas.push(carta);

            // Animar SOLO esta carta
            setTimeout(() => {
                animarCarta(i, carta, true); // pasamos un flag que indica "solo nueva"
            }, j * 300);
        }
    });
});
