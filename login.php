<?php
include_once("conexion.php");
session_start();

if(!empty($_POST['user']) && !empty($_POST['pass'])){

    //Volcado de datos a variables locales
    $user = $_POST['user'];
    $pass = $_POST['pass'];

    //Se confirma que no exista el usuario antes
    $sql = "SELECT * FROM usuarios WHERE User='$user' AND Pass='$pass'";

    $resultado = mysqli_query($conexion,$sql);
    $filas = mysqli_num_rows($resultado);

    while($row=mysqli_fetch_assoc($resultado)) {

        $Id_Usuario=$row["Id_Usuario"];
        $nombre=$row["Nombre"];
        $amat=$row["Amat"];
        $apat=$row["Apat"];
        $user=$row["User"];
        $correo=$row["Correo"];

        $_SESSION['Id_Usuario']=$Id_Usuario;
        $_SESSION['Correo']=$correo;
        $_SESSION['Amat']=$amat;
        $_SESSION['Apat']=$apat;
        $_SESSION['Nombre']=$nombre;
        $_SESSION['User']=$user;

    }

    if($filas > 0 ){
        
    header('location: inicio.php');
    }

    echo "<script>alert('Usuario Inexistente'); window.history.go(-1);</script>";


}else{//3ra validacion para evitar campos vacios
    echo "<script>alert('Ingresa todos los datos'); window.history.go(-1)</script>";
}