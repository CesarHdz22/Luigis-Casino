const palos = ['♥','♦','♣','♠'];
const valores = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

let mazo = [];
let pot = 0;
let jugadorActual = 0; 
let rondaApuestaActiva = false;
let community = []; 
let fase = 0; 
let apuestaMaximaRonda = 0;
let dealerIndex = -1;
const SMALL_BLIND = 50;
const BIG_BLIND = 100;

function findNextActiveIndex(startIndex, numPlayers) {
    let index = startIndex;
    let intentos = 0;
    do {
        index = (index + 1) % numPlayers;
        intentos++;
        if (intentos > numPlayers) return -1; 
    } while (!jugadores[index].activo);
    return index;
}

function postBlind(index, amount) {
    const jugador = jugadores[index];
    if (jugador.activo) {
        let commit = Math.min(amount, jugador.stack);
        jugador.stack -= commit;
        pot += commit;
        jugador.apuestaActual = commit;
    }
}

const jugadores = [
    {id: 'p1', cartas: [], stack: 10000, activo: false, fold: false, accion: null, apuestaActual: 0},
    {id: 'p2', cartas: [], stack: 10000, activo: false, fold: false, accion: null, apuestaActual: 0},
    {id: 'p3', cartas: [], stack: 10000, activo: false, fold: false, accion: null, apuestaActual: 0},
    {id: 'p4', cartas: [], stack: 10000, activo: false, fold: false, accion: null, apuestaActual: 0},
    {id: 'p5', cartas: [], stack: 10000, activo: false, fold: false, accion: null, apuestaActual: 0}
];

actualizarStacksYPot();

function crearMazo() {
    mazo = [];
    for (let palo of palos) {
        for (let valor of valores) {
            mazo.push({valor, palo});
        }
    }
    mezclarMazo(mazo);
}

function mezclarMazo(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

crearMazo();

function repartirCartasPrivadas() {
    crearMazo();
    fase = 0;
    pot = 0;
    community = [];
    iniciarNuevaCalle();
    
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`c${i}`).innerHTML = '';
    }
    document.querySelector('.pot').textContent = 'Pozo: $0';
    
    jugadores.forEach(j => {
        j.cartas = [];
        j.fold = false;
        j.accion = null;
        const handDiv = document.querySelector(`#${j.id} .hand`);
        if(handDiv) handDiv.innerHTML = '<div class="card-slot"></div><div class="card-slot"></div>';
    });


    dealerIndex = findNextActiveIndex(dealerIndex, jugadores.length);
    if (dealerIndex === -1) { 
        alert("¡Error! Se requieren al menos dos jugadores activos. (Usa 'Unirme')"); 
        return; 
    }

    let sbIndex = findNextActiveIndex(dealerIndex, jugadores.length);
    let bbIndex = findNextActiveIndex(sbIndex, jugadores.length);

    postBlind(sbIndex, SMALL_BLIND);
    postBlind(bbIndex, BIG_BLIND);
    
    apuestaMaximaRonda = BIG_BLIND;

    jugadorActual = findNextActiveIndex(bbIndex, jugadores.length);
    
    actualizarStacksYPot();

    repartirConAnimacionActivos(); 
}

function repartirConAnimacionActivos() {
    const dealer = document.getElementById('dealer-video');
    if (dealer) {
        dealer.classList.add('active');
        dealer.currentTime = 0;
        dealer.play();
    }

    const jugadoresActivos = jugadores.filter(j => j.activo);

    if (jugadoresActivos.length < 2) {
        alert("Se necesitan al menos 2 jugadores activos (Usa el botón 'Unirme').");
        if(dealer) dealer.classList.remove('active');
        return;
    }

    jugadoresActivos.forEach(j => {
        const handDiv = document.querySelector(`#${j.id} .hand`);
        handDiv.innerHTML = ''; 
    });

    let delay = 0;

    for (let round = 0; round < 2; round++) {
        jugadoresActivos.forEach((j) => {
            const index = jugadores.indexOf(j);
            const carta = mazo.pop(); 
            j.cartas.push(carta);
            
            setTimeout(() => {
                animarCarta(index, carta);
            }, delay);

            delay += 300;
        });
    }

    setTimeout(() => {
        if (dealer) dealer.classList.remove('active');
        siguienteTurno();
    }, delay + 500);
}

function actualizarStacksYPot() {
    jugadores.forEach(j => {
        const stackSpan = document.querySelector(`#${j.id} .stack`);
        if(stackSpan) stackSpan.textContent = `$${j.stack.toLocaleString()}`;
    });
    const potDiv = document.querySelector('.pot');
    if(potDiv) potDiv.textContent = `Pozo: $${pot.toLocaleString()}`;
    document.querySelectorAll('.player-status').forEach(el => el.textContent = '');
    
    
}


function siguienteTurno() {
    let intentos = 0;
    do {
        jugadorActual = (jugadorActual + 1) % jugadores.length;
        intentos++;
        if (intentos > 10) return; 
    } while (!jugadores[jugadorActual].activo || jugadores[jugadorActual].fold);

    const jugador = jugadores[jugadorActual];
    
    const callAmount = apuestaMaximaRonda - jugador.apuestaActual;

    document.querySelectorAll('.player').forEach(p => p.style.border = "none");
    const divJugador = document.getElementById(jugador.id);
    if(divJugador) divJugador.style.border = "2px solid yellow";

    const btnCheck = document.getElementById('btn-check');
    const btnCall = document.getElementById('btn-call');
    const btnRaise = document.getElementById('btn-raise');
    const btnFold = document.getElementById('btn-fold');

    [btnCheck, btnCall, btnRaise, btnFold].forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = 1;
    });

    if (callAmount > 0) {
        btnCheck.disabled = true;
        btnCheck.style.opacity = 0.4;
        
        btnCall.textContent = `Pagar ($${callAmount.toLocaleString()})`;
        
    } else {
        btnCheck.disabled = false;
        btnCheck.style.opacity = 1;
        
        btnCall.textContent = `Pagar`;
        btnCall.disabled = true; 
        btnCall.style.opacity = 0.4;
    }
    
    if (jugador.stack <= callAmount) {
        btnRaise.disabled = true;
        btnRaise.style.opacity = 0.4;
        if(callAmount > 0) btnCall.textContent = `All-in ($${jugador.stack.toLocaleString()})`;
    }
}



function verificarRonda() {
    let activosEnJuego = jugadores.filter(j => j.activo && !j.fold);
    
    if (activosEnJuego.length === 1) {
        const ganador = activosEnJuego[0];
        alert(`🏆 ¡GANADOR por retiro! ${ganador.id} gana el pozo de $${pot.toLocaleString()}.`);
        
        ganador.stack += pot;
        pot = 0;
        
        actualizarStacksYPot();
        
        setTimeout(() => {
            limpiarMesa();
        }, 4000);
        return;
    }

    let todosActuaron = true;
    
    activosEnJuego.forEach(j => {
        if (j.accion === null || j.apuestaActual < apuestaMaximaRonda) {
            if (apuestaMaximaRonda > 0 && j.accion === null) {
                todosActuaron = false;
            } else if (apuestaMaximaRonda === 0 && j.accion === null) {
                todosActuaron = false;
            }
        }
    });

    activosEnJuego.forEach(j => {
        if (!j.accion) todosActuaron = false;
    });


    if (todosActuaron) {
        jugadores.forEach(j => j.accion = null);
        apuestaMaximaRonda = 0;

        if (fase === 0) repartirFlop();
        else if (fase === 1) repartirTurn();
        else if (fase === 2) repartirRiver();
        else if (fase === 3) {
            setTimeout(ejecutarShowdown, 500);
        }
    }
}


function animarCarta(jugadorIndex, carta, esNueva = false) {
    const jugador = document.getElementById(jugadores[jugadorIndex].id);
    const hand = jugador.querySelector('.hand');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card-anim');
    
    cardDiv.textContent = `${carta.valor}${carta.palo}`;
    if (carta.palo === '♥' || carta.palo === '♦') cardDiv.classList.add('red');
    else cardDiv.classList.add('black');
    cardDiv.classList.add('card-slot');

    document.body.appendChild(cardDiv);

    const handRect = hand.getBoundingClientRect();
    const finalX = handRect.left + handRect.width / 2 - 30;
    const finalY = handRect.top + handRect.height / 2 - 42; 

    
    const startX = window.innerWidth / 2 - 30; 
    const startY = window.innerHeight / 2 - 200; 

    
    cardDiv.style.position = 'fixed';
    cardDiv.style.left = startX + 'px'; 
    cardDiv.style.top = startY + 'px';
    cardDiv.style.transition = 'none'; 

    
    setTimeout(() => {
        cardDiv.style.transition = 'all 0.5s ease';
        cardDiv.style.left = finalX + 'px';
        cardDiv.style.top = finalY + 'px';
    }, 50);

    cardDiv.addEventListener('transitionend', () => {
        cardDiv.remove();
        
        if (!esNueva) {
            hand.innerHTML = '';
            jugadores[jugadorIndex].cartas.forEach(c => {
                crearElementoCarta(c, hand);
            });
        } else {
            crearElementoCarta(carta, hand);
        }
    });
}

function crearElementoCarta(carta, contenedor) {
    const slot = document.createElement('div');
    slot.classList.add('card-slot');
    slot.textContent = `${carta.valor}${carta.palo}`;
    if (carta.palo === '♥' || carta.palo === '♦') slot.classList.add('red');
    else slot.classList.add('black');
    contenedor.appendChild(slot);
}

function animarCommunity(index, carta) {
    const slot = document.getElementById(`c${index+1}`);
    const anim = document.createElement('div');
    anim.classList.add('card-anim', 'card-slot');
    
    anim.textContent = `${carta.valor}${carta.palo}`;
    if (carta.palo === '♥' || carta.palo === '♦') anim.classList.add('red');
    else anim.classList.add('black');

    document.body.appendChild(anim);

    const rect = slot.getBoundingClientRect();
    const finalX = rect.left;
    const finalY = rect.top;
    
    const startX = window.innerWidth / 2 - 30;
    const startY = window.innerHeight / 2 - 200;

    anim.style.position = 'fixed';
    anim.style.left = startX + 'px'; 
    anim.style.top = startY + 'px';
    anim.style.transition = 'none'; 

    setTimeout(() => {
        anim.style.transition = 'all 0.5s ease';
        anim.style.left = finalX + 'px';
        anim.style.top = finalY + 'px';
    }, 50);

    anim.addEventListener('transitionend', () => {
        anim.remove();
        mostrarCommunity();
    });
}

function mostrarCommunity() {
    if (community.length >= 3) bloquearUnirse();

    for (let i = 0; i < 5; i++) {
        const slot = document.getElementById(`c${i+1}`);
        slot.innerHTML = '';
        if (community[i]) {
            crearElementoCarta(community[i], slot);
        }
    }
}

function bloquearUnirse() {
    document.querySelectorAll('.join-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = 0.5;
    });
}

document.getElementById('btn-check').addEventListener('click', () => {
    const jugador = jugadores[jugadorActual];
    
    if (apuestaMaximaRonda === jugador.apuestaActual) {
        jugador.accion = 'check';
        siguienteTurno();
        verificarRonda();
    } else {
        alert("¡Acción ilegal! Debes pagar, subir o retirarte.");
    }
});

document.getElementById('btn-call').addEventListener('click', () => {
    const jugador = jugadores[jugadorActual];
    const callAmount = apuestaMaximaRonda - jugador.apuestaActual;
    
    if (callAmount > 0) {
        let amountToCommit = Math.min(callAmount, jugador.stack);
        
        jugador.stack -= amountToCommit;
        pot += amountToCommit;
        jugador.apuestaActual += amountToCommit;
    } else {
        return;
    }

    actualizarStacksYPot();
    jugador.accion = 'call';
    siguienteTurno();
    verificarRonda();
});

document.getElementById('btn-raise').addEventListener('click', () => {
    const jugador = jugadores[jugadorActual];
    
    const raiseSize = 2000;
    const requiredRaiseTotal = apuestaMaximaRonda + raiseSize;
    const amountToCommit = requiredRaiseTotal - jugador.apuestaActual;

    if (jugador.stack >= amountToCommit && amountToCommit > 0) {
        jugador.stack -= amountToCommit;
        pot += amountToCommit;
        jugador.apuestaActual += amountToCommit;
        apuestaMaximaRonda = jugador.apuestaActual;
    } else {
        alert("No tienes suficientes fichas o el Raise no es válido.");
        return;
    }
    
    actualizarStacksYPot();
    jugador.accion = 'raise';
    siguienteTurno();
    verificarRonda();
});

document.getElementById('btn-start').addEventListener('click', () => {
    repartirCartasPrivadas();
    jugadorActual = -1;
    rondaApuestaActiva = true;
});

document.getElementById('btn-reset').addEventListener('click', () => {
    limpiarMesa();
});

document.querySelectorAll('.join-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
        const jugador = jugadores[i];
        
        jugador.activo = true;
        
        btn.style.display = 'none';

        const playerDiv = document.getElementById(jugador.id);
        if(playerDiv) {
            playerDiv.style.opacity = "1";
        }
    });
});

document.getElementById('btn-fold').addEventListener('click', () => {
    const jugador = jugadores[jugadorActual];

    jugador.fold = true;
    jugador.accion = 'fold';

    const divJugador = document.getElementById(jugador.id);
    if(divJugador) {
        divJugador.style.opacity = 0.5;
        divJugador.style.border = "2px dashed grey";
    }

    siguienteTurno();
    
    verificarRonda();
});

function iniciarNuevaCalle() {
    apuestaMaximaRonda = 0;
    jugadores.forEach(j => {
        j.accion = null;
        j.apuestaActual = 0; 
    });
}

function repartirFlop() {
    if (fase !== 0) return;
    fase = 1;
    iniciarNuevaCalle();
    mazo.pop();
    let delay = 0;
    for (let i = 0; i < 3; i++) {
        const carta = mazo.pop();
        community.push(carta);
        setTimeout(() => animarCommunity(i, carta), delay);
        delay += 400;
    }
}

function repartirTurn() {
    if (fase !== 1) return;
    fase = 2;
    iniciarNuevaCalle();
    mazo.pop();
    const carta = mazo.pop();
    community.push(carta);
    animarCommunity(3, carta);
}

function repartirRiver() {
    if (fase !== 2) return;
    fase = 3;
    iniciarNuevaCalle();
    mazo.pop();
    const carta = mazo.pop();
    community.push(carta);
    animarCommunity(4, carta);
}

function limpiarMesa() {
    crearMazo();
    fase = 0;
    pot = 0;
    community = [];
    iniciarNuevaCalle();
    jugadores.forEach(j => {
        j.cartas = [];
        j.activo = false;
        j.fold = false;
        const hand = document.querySelector(`#${j.id} .hand`);
        if(hand) hand.innerHTML = '<div class="card-slot"></div><div class="card-slot"></div>';
        const joinBtn = document.querySelector(`#${j.id} .join-btn`);
        if(joinBtn) {
            joinBtn.style.display = 'block';
            joinBtn.disabled = false;
            joinBtn.style.opacity = '1';
        }
    });
    actualizarStacksYPot();
    for (let i = 1; i <= 5; i++) document.getElementById(`c${i}`).innerHTML = '';
}

const RANK_VALUE = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
    "10": 10, "J": 11, "Q": 12, "K": 13, "A": 14
};

function combinations(arr, k) {
    const res = [];
    const n = arr.length;
    function go(start, chosen) {
        if (chosen.length === k) {
            res.push(chosen.slice());
            return;
        }
        for (let i = start; i < n; i++) {
            chosen.push(arr[i]);
            go(i + 1, chosen);
            chosen.pop();
        }
    }
    go(0, []);
    return res;
}

function evaluate5(cards5) {
    const vals = cards5.map(c => RANK_VALUE[c.valor]).sort((a, b) => b - a);
    
    const count = {};
    cards5.forEach(c => {
        const v = RANK_VALUE[c.valor];
        count[v] = (count[v] || 0) + 1;
    });

    const byCount = {};
    Object.keys(count).forEach(k => {
        const n = count[k];
        if (!byCount[n]) byCount[n] = [];
        byCount[n].push(Number(k));
    });
    Object.keys(byCount).forEach(k => byCount[k].sort((a, b) => b - a));

    const suits = {};
    cards5.forEach(c => suits[c.palo] = (suits[c.palo] || 0) + 1);
    const isFlush = Object.values(suits).some(x => x === 5);

    const uniqueVals = Array.from(new Set(vals)).sort((a, b) => b - a);
    let isStraight = false;
    let straightHigh = null;

    if (uniqueVals.length >= 5) {
        for (let i = 0; i <= uniqueVals.length - 5; i++) {
            const slice = uniqueVals.slice(i, i + 5);
            if (slice[0] - slice[4] === 4) {
                isStraight = true;
                straightHigh = slice[0];
                break;
            }
        }
        if (!isStraight) {
            const hasAce = uniqueVals.includes(14);
            const has5432 = [5, 4, 3, 2].every(v => uniqueVals.includes(v));
            if (hasAce && has5432) {
                isStraight = true;
                straightHigh = 5;
            }
        }
    }

    if (isFlush && isStraight) {
        return { rank: 9, tiebreaker: [straightHigh], name: (straightHigh === 14 ? 'Royal Flush' : 'Straight Flush') };
    }
    if (byCount[4]) {
        return { rank: 8, tiebreaker: [byCount[4][0]], name: 'Four of a Kind' };
    }
    if (byCount[3] && (byCount[2] || byCount[3].length > 1)) {
        const trip = byCount[3][0];
        const pair = byCount[2] ? byCount[2][0] : byCount[3][1];
        return { rank: 7, tiebreaker: [trip, pair], name: 'Full House' };
    }
    if (isFlush) {
        return { rank: 6, tiebreaker: vals.slice(0, 5), name: 'Flush' };
    }
    if (isStraight) {
        return { rank: 5, tiebreaker: [straightHigh], name: 'Straight' };
    }
    if (byCount[3]) {
        const kickers = vals.filter(v => v !== byCount[3][0]).slice(0, 2);
        return { rank: 4, tiebreaker: [byCount[3][0], ...kickers], name: 'Three of a Kind' };
    }
    if (byCount[2] && byCount[2].length >= 2) {
        const p1 = byCount[2][0];
        const p2 = byCount[2][1];
        const kicker = vals.filter(v => v !== p1 && v !== p2)[0];
        return { rank: 3, tiebreaker: [p1, p2, kicker], name: 'Two Pair' };
    }
    if (byCount[2]) {
        const p1 = byCount[2][0];
        const kickers = vals.filter(v => v !== p1).slice(0, 3);
        return { rank: 2, tiebreaker: [p1, ...kickers], name: 'One Pair' };
    }
    return { rank: 1, tiebreaker: vals.slice(0, 5), name: 'High Card' };
}

function bestHandFrom7(cards7) {
    const combs = combinations(cards7, 5);
    let best = null;
    let bestHandCards = [];

    combs.forEach(c5 => {
        const result = evaluate5(c5);
        if (!best) {
            best = result;
            bestHandCards = c5;
        } else {
            const comparison = compareEvaluatedLogic(result, best);
            if (comparison > 0) {
                best = result;
                bestHandCards = c5;
            }
        }
    });

    return { best, bestHandCards };
}

function compareEvaluatedLogic(a, b) {
    if (a.rank !== b.rank) {
        return a.rank - b.rank;
    }
    for (let i = 0; i < a.tiebreaker.length; i++) {
        const valA = a.tiebreaker[i] || 0;
        const valB = b.tiebreaker[i] || 0;
        if (valA !== valB) {
            return valA - valB;
        }
    }
    return 0;
}

function determinarGanador(jugadores, community) {
    const resultados = [];

    console.log("--- INICIANDO SHOWDOWN ---");
    console.log("Cartas Comunitarias:", community.map(c => `${c.valor}${c.palo}`));

    jugadores.forEach(j => {
        if (j.activo && !j.fold) {
            const pool = [...j.cartas, ...community];
            if (pool.length < 5) return;
            
            const mejorMano = bestHandFrom7(pool);
            
            console.log(`Jugador ${j.id} tiene: ${mejorMano.best.name}`, mejorMano.best.tiebreaker);
            
            resultados.push({
                id: j.id,
                best: mejorMano.best,
                handCards: mejorMano.bestHandCards,
                jugador: j
            });
        }
    });

    if (resultados.length === 0) return null;

    resultados.sort((a, b) => {
        return compareEvaluatedLogic(b.best, a.best);
    });

    const winners = [resultados[0]];
    for (let i = 1; i < resultados.length; i++) {
        if (compareEvaluatedLogic(resultados[i].best, resultados[0].best) === 0) {
            winners.push(resultados[i]);
        } else {
            break;
        }
    }

    return { winners, all: resultados };
}

function ejecutarShowdown() {
    while (community.length < 5 && mazo.length > 0) {
        mazo.pop();
        const c = mazo.pop();
        if(c) community.push(c);
    }
    mostrarCommunity();

    jugadores.forEach((j, index) => {
        if(j.activo && !j.fold) {
            const handDiv = document.querySelector(`#${j.id} .hand`);
            handDiv.innerHTML = '';
            j.cartas.forEach(c => crearElementoCarta(c, handDiv));
        }
    });

    const resultado = determinarGanador(jugadores, community);

    if (!resultado || !resultado.winners || resultado.winners.length === 0) {
        alert("Error: No se pudo determinar un ganador (posiblemente falta de cartas).");
        limpiarMesa();
        return;
    }

    let mensaje = "";
    if (resultado.winners.length > 1) {
        mensaje = "¡EMPATE! Se reparte el pozo entre:\n";
        const splitPot = Math.floor(pot / resultado.winners.length);
        
        resultado.winners.forEach(w => {
            mensaje += `- ${w.id} con ${w.best.name}\n`;
            const jGanador = jugadores.find(jug => jug.id === w.id);
            if(jGanador) jGanador.stack += splitPot;
        });
    } else {
        const w = resultado.winners[0];
        mensaje = `¡GANADOR: ${w.id}!\nMano: ${w.best.name}\nGana: $${pot.toLocaleString()}`;
        
        const jGanador = jugadores.find(jug => jug.id === w.id);
        if(jGanador) jGanador.stack += pot;
    }

    alert(mensaje);
    
    pot = 0;
    actualizarStacksYPot();
    
    setTimeout(() => {
        limpiarMesa();
    }, 4000);
}