<?php 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use ElephantIO\Client, ElephantIO\Engine\SocketIO\Version1X;

require __DIR__ . '/autoload.php';

$username = $_COOKIE["user_cookie"];
$chipAmount = $_COOKIE["chip_cookie"];
$server = $_COOKIE["server_cookie"];
$turingIP = 'http://192.168.1.97:3000/';


if ($server == $turingIP) {
  $client = new Client(new Version1X('http://192.168.1.97:3000'));
  
  $client->initialize();
  $client->emit('linkUsername', [$username, $chipAmount]);
  $client->emit('linkChipAmount', [$chipAmount]);
  $client->emit('disconnectLink', []);
  $client->close();
  
}
?>

<html>
  <head>
    <title>Poker Room Redirect</title>
    <META http-equiv="refresh" content="5; url=<?php echo $_COOKIE["server_cookie"] ?>">
  </head>
  <body bgcolor="#ffffff">
    <center>Hi, <?php echo $_COOKIE["user_cookie"] ?>, you will be redirected to your game server (<?php echo $_COOKIE["server_cookie"] ?>) shortly...</a>
    </center>
  </body>
</html>




 