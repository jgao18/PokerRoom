<?php
include ("PersistentSessionHandler.php");
include ("Psr4AutoloaderClass.php");
include ("db_connect.php");
$loader = new Psr4AutoloaderClass();
$loader->register();
$handler = new PersistentSessionHandler($db);
session_set_save_handler($handler);
session_start();
$_SESSION['active'] = time();
