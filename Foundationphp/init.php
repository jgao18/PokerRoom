<?php
//use Foundationphp\Sessions\PersistentSessionHandler;
include ("PersistentSessionHandler.php");

include ("Psr4AutoloaderClass.php");
include ("db_connect.php");
//include("Psr4AutoloaderClass.php");
//include("db_connect.php");

$loader = new Psr4AutoloaderClass();
$loader->register();
//$loader->addNamespace('Foundationphp', __DIR__ . '/../../Foundationphp');

$handler = new PersistentSessionHandler($db);
session_set_save_handler($handler);
session_start();
$_SESSION['active'] = time();
