<?php
session_start();

// Si el usuario NO ha iniciado sesión, lo mandamos al login
if (empty($_SESSION['Id_Usuario'])) {
    header("Location: index.html");
    exit();
}

// Obtener el juego elegido
$juego = isset($_GET['juego']) ? $_GET['juego'] : '';

$nombreJuego = "";

// Traducimos el valor en texto bonito
switch ($juego) {
    case "texas":
        $nombreJuego = "Poker Texas Hold'em";
        break;
    case "omaha":
        $nombreJuego = "Poker Omaha";
        break;
    case "memorama":
        $nombreJuego = "Memorama";
        break;
    case "mini":
        $nombreJuego = "Mini-Juego Especial";
        break;
    default:
        $nombreJuego = "Juego desconocido";
        break;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Luigi's Casino - Mesas</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="css/mesas.css">
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
        <h2 class="title">Elige una mesa para jugar</h2>

        <div class="mesas-container">

            <a href="juego.php?juego=<?php echo $nombreJuego; ?>&id=1" class="mesa-link">
                <div class="mesa-card">
                    <div class="mesa-img"></div>
                    <h3>Mesa 1</h3>
                    <p class="jugadores">Jugadores: 0 / 10</p>
                </div>
            </a>

            <a href="juego.php?juego=<?php echo $nombreJuego; ?>&id=2" class="mesa-link">
                <div class="mesa-card">
                    <div class="mesa-img"></div>
                    <h3>Mesa 2</h3>
                    <p class="jugadores">Jugadores: 3 / 10</p>
                </div>
            </a>

            <a href="juego.php?juego=<?php echo $nombreJuego; ?>&id=3" class="mesa-link">
                <div class="mesa-card">
                    <div class="mesa-img"></div>
                    <h3>Mesa 3</h3>
                    <p class="jugadores">Jugadores: 7 / 10</p>
                </div>
            </a>

            <a href="juego.php?juego=<?php echo $nombreJuego; ?>&id=4" class="mesa-link">
                <div class="mesa-card">
                    <div class="mesa-img"></div>
                    <h3>Mesa 4</h3>
                    <p class="jugadores">Jugadores: 1 / 10</p>
                </div>
            </a>

        </div>
    </main>



</body>
</html>
