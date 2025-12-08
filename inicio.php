<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Luigi's Casino - Inicio</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="css/inicio.css">
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
        <h2 class="title">Elige tu juego</h2>

        <div class="game-options">
            <a href="mesas.php?juego=memorama" class="btn">🧠 Memorama</a>
            <a href="mesas.php?juego=texas" class="btn">♠️ Poker Texas Hold'em</a>
            <a href="omaha_lobby.php" class="btn">♦️ Poker Omaha</a>
            <a href="mesas.php?juego=minijuego" class="btn">🎮 Minijuego Especial</a>
        </div>
    </main>

</body>
</html>
