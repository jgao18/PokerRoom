<?php
require_once ("init.php");
require_once ("AutoLogin.php");

//use Foundationphp\Sessions\AutoLogin;

if (isset($_SESSION['authenticated']) || isset($_SESSION['lynda_auth'])) {
   // we're OK
} else {
    $autologin = new AutoLogin($db);
    $autologin->checkCredentials();
    if (!isset($_SESSION['lynda_auth'])) {
        header('Location: login.php');
        exit;
    }
}