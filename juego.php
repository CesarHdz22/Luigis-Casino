<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Luigi's Casino - Juego</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="css/juego.css">
    <link rel="shortcut icon" href="css/assets/iconoLuigi.png">
</head>
<body>

    <header class="casino-header">
        <h1 class="casino-title"> Luigi's Casino</h1>
        <div class="user-info">
            <span class="username">Bienvenido, <strong>Usuario123</strong></span>
            <a href=""><img src="css/assets/salida.png" alt="Cerrar Sesion" width="30px" class="logout-btn"></a>
        </div>
    </header>

    <main class="casino-menu">

        
        <div id="player-money"></div>

        <div class="mesa-container">

           
            <div id="dealer-area">
            <video id="dealer-video" src="css/assets/luigi-casino.mp4" muted loop></video>
            </div>

            <div class="mesa">
                <div class="felt">

                    <div class="center-area">

                        <div class="community">
                            <div class="card-slot" id="c1"></div>
                            <div class="card-slot" id="c2"></div>
                            <div class="card-slot" id="c3"></div>
                            <div class="card-slot" id="c4"></div>
                            <div class="card-slot" id="c5"></div>
                        </div>

                        <div class="pot">Pozo: $0</div>

                    </div>

                    <div class="actions">
                        <button id="btn-check">Check</button>
                        <button id="btn-call">Call</button>
                        <button id="btn-raise">Raise</button>
                        <button id="btn-fold">Fold</button>
                    </div>

                    <div id="players-container">

                        <div class="player" id="p1">
                            <div class="seat-box">
                                Jugador 1
                                <span class="stack">$10,000</span> 
                            </div>

                            <div class="hand">
                                <div class="card-slot"></div>
                                <div class="card-slot"></div>
                            </div>

                            <button class="join-btn">Unirme</button>
                        </div>

                        <div class="player" id="p2">
                            <div class="seat-box">
                                Jugador 2
                                <span class="stack">$10,000</span>
                            </div>
                            <div class="hand">
                                <div class="card-slot"></div>
                                <div class="card-slot"></div>
                            </div>
                            <button class="join-btn">Unirme</button>
                        </div>

                        <div class="player" id="p3">
                            <div class="seat-box">
                                Jugador 3
                                <span class="stack">$10,000</span>
                            </div>
                            <div class="hand">
                                <div class="card-slot"></div>
                                <div class="card-slot"></div>
                            </div>
                            <button class="join-btn">Unirme</button>
                        </div>

                        <div class="player" id="p4">
                            <div class="seat-box">
                                Jugador 4
                                <span class="stack">$10,000</span>
                            </div>
                            <div class="hand">
                                <div class="card-slot"></div>
                                <div class="card-slot"></div>
                            </div>
                            <button class="join-btn">Unirme</button>
                        </div>

                        <div class="player" id="p5">
                            <div class="seat-box">
                                Jugador 5
                                <span class="stack">$10,000</span>
                            </div>
                            <div class="hand">
                                <div class="card-slot"></div>
                                <div class="card-slot"></div>
                            </div>
                            <button class="join-btn">Unirme</button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
        <div id="game-controls">
    <button id="btn-start">Start</button>
    <button id="btn-reset">Reset</button>
</div>
    </main>




</body>
<script src="js/texas.js"></script>
<script>
    mezclarMazo(mazo);

    repartirConAnimacion();
</script>
</html>