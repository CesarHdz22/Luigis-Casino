<?php
session_start();
// === CONEXIÓN A LA B.D. ===
// 1. Incluir tu archivo central de conexión, que define la variable $conexion (mysqli object)
require_once 'conexion.php'; 

// 2. Comprobación de conexión (opcional, pero buena práctica)
if (!isset($conexion) || $conexion === false) {
    // Si la conexión falló o no se definió, redirigir
    error_log("Error: La conexión a la base de datos (mysqli) no fue establecida en conexion.php.");
    header('Location: omaha_lobby.php?error=db_connect');
    exit;
}

// Comprobar si se ha pasado el nombre de usuario
if(!isset($_GET['usuarios'])){
    header('Location: omaha_lobby.php'); 
    exit;
}

$nombre_usuario = htmlspecialchars($_GET['usuarios']);
$saldo = 1000; // Saldo por defecto de fallback
$jugador_encontrado = false;

// === CONSULTA USANDO MYSQLI ===

// 1. Preparar la consulta usando la sintaxis de mysqli (bind_param)
$query = "SELECT Pass FROM usuarios WHERE User = ?";

// Utilizamos la variable $conexion definida en conexion.php
if ($stmt = mysqli_prepare($conexion, $query)) {
    // 2. Asociar el parámetro
    mysqli_stmt_bind_param($stmt, "s", $nombre_usuario);
    
    // 3. Ejecutar la consulta
    mysqli_stmt_execute($stmt);
    
    // 4. Obtener el resultado
    $result = mysqli_stmt_get_result($stmt);
    $usuario_db = mysqli_fetch_assoc($result);

    if ($usuario_db) {
         // Usamos el campo 'Pass' como saldo inicial de prueba
         $saldo = intval($usuario_db['Pass']) * 100; 
         $jugador_encontrado = true;
    }

    // 5. Cerrar el statement
    mysqli_stmt_close($stmt);
} else {
    error_log("Error al preparar la consulta: " . mysqli_error($conexion));
}
// === FIN DE CONSULTA MYSQLI ===


if(!$jugador_encontrado){
    // Redirigir si el usuario no existe o si hubo un error de conexión
    header('Location: omaha_lobby.php'); 
    exit;
}
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title> Mesa - Poker Omaha Hold</title>
<link rel="stylesheet" href="css/omaha_style.css"> 
<link rel="stylesheet" href="css/juego.css"> 
</head>
<body>

<header class="casino-header">
    <h1 class="casino-title"> Mesa Omaha Hold'em</h1>
    <div class="user-info">
        <span class="username">Jugador: <strong id="playerNameDisplay"><?= $nombre_usuario ?></strong></span>
        <a href="mesas.php"><img src="css/assets/salida.png" alt="Salir de la Mesa" width="30px" class="logout-btn"></a>
    </div>
</header>

<main class="omaha-table-view">

    <section class="table-area">
        <div class="mesa"> 
            <div class="felt"> 

                <div class="center-area">
                    <h3>Cartas Comunitarias</h3>
                    <div class="community-cards" id="community">
                        <div class="card-slot"></div>
                        <div class="card-slot"></div>
                        <div class="card-slot"></div>
                        <div class="card-slot"></div>
                        <div class="card-slot"></div>
                    </div>
                    <div class="pot">Total Pozo: $<span id="pot">0</span></div>
                </div>

                <section class="players-list" id="playersListStatic">
                    
                    <div class="player seat-1" data-seat-id="1">
                        <div class="player-info" id="seatInfo-1">ASIENTO 1</div>
                        <button class="join-btn" data-seat="1">Unirme aquí</button> 
                    </div>
                    
                    <div class="player seat-2" data-seat-id="2"><div class="player-info" id="seatInfo-2">ASIENTO 2</div><button class="join-btn" data-seat="2">Unirme</button></div>
                    <div class="player seat-3" data-seat-id="3"><div class="player-info" id="seatInfo-3">ASIENTO 3</div><button class="join-btn" data-seat="3">Unirme</button></div>
                    <div class="player seat-4" data-seat-id="4"><div class="player-info" id="seatInfo-4">ASIENTO 4</div><button class="join-btn" data-seat="4">Unirme</button></div>
                    <div class="player seat-5" data-seat-id="5"><div class="player-info" id="seatInfo-5">ASIENTO 5</div><button class="join-btn" data-seat="5">Unirme</button></div>
                    <div class="player seat-6" data-seat-id="6"><div class="player-info" id="seatInfo-6">ASIENTO 6</div><button class="join-btn" data-seat="6">Unirme</button></div>
                    <div class="player seat-7" data-seat-id="7"><div class="player-info" id="seatInfo-7">ASIENTO 7</div><button class="join-btn" data-seat="7">Unirme</button></div>
                    <div class="player seat-8" data-seat-id="8"><div class="player-info" id="seatInfo-8">ASIENTO 8</div><button class="join-btn" data-seat="8">Unirme</button></div>
                    
                </section>
            </div>
        </div>
    </section>
    
    <section class="controls">
    
        <div class="player-info-container">
            
            <div class="player-hand-area">
                <div class="hand-label">Tus 4 Cartas (Omaha)</div>
                <div id="holeCards">
                    </div>
            </div>
            
            <div class="hand-zone">
                <div class="balance-display">
                    Dinero: $<span id="balance"><?= $saldo ?></span>
                </div>
            </div>
            
        </div>
        
        <div class="actions">
            <button id="btnFold">Fold</button>
            <button id="btnCheck">Check / Call</button>
            <div class="bet-input-group">
                <input id="betAmount" type="number" value="10" min="1" />
                <button id="btnBet">Bet</button>
            </div>
        </div>
    </section>
</main>

<script src="/socket.io/socket.io.js"></script> 
<script src="js/omaha_script.js"></script>
</body>
</html>