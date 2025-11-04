<?php
include_once("conexion.php");
session_start();

if(!empty($_POST['nombre']) && !empty($_POST['apat']) && !empty($_POST['amat']) && !empty($_POST['correo'])
   && !empty($_POST['user']) && !empty($_POST['pass'])){

    //Volcado de datos a variables locales
    $nombre = $_POST['nombre'];
    $apat = $_POST['apat'];
    $amat = $_POST['amat'];
    $correo = $_POST['correo'];
    $user = $_POST['user'];
    $pass = $_POST['pass'];

    //Se confirma que no exista el usuario antes
    $sql = "SELECT * FROM usuarios WHERE Correo = '$correo' OR User = '$user'";

    $resultado = mysqli_query($conexion,$sql);
    $filas = mysqli_num_rows($resultado);

    if($filas == 0){
        $sql2 = "INSERT INTO usuarios VALUES('','$nombre','$apat','$amat','$correo','$user','$pass')";

        if($resultado2 = mysqli_query($conexion,$sql2)){
            echo "<script> alert('Registro completado'); window.history.go(-2)</script>";
        }

    }else{
        echo "<script>alert('Ya existe un usuario con esos datos'); window.history.go(-1)</script>";
    }


}else{//3ra validacion para evitar campos vacios
    echo "<script>alert('Ingresa todos los datos'); window.history.go(-1)</script>";
}