<?php 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use ElephantIO\Client, ElephantIO\Engine\SocketIO\Version1X;

require __DIR__ . '/autoload.php';

$username = $_COOKIE["user_cookie"];
$chipAmount = $_COOKIE["chip_cookie"];
$server = $_COOKIE["server_cookie"];

// If it IS a Turing server
if (strpos($server, 'http://192.168.1.97:') !== FALSE) {
  $client = new Client(new Version1X($server)); // This does not like it if you include the backslash at the end of the address!
  
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
    <META http-equiv="refresh" content="0; url=<?php echo $_COOKIE["server_cookie"] ?>">
  </head>
  <body bgcolor="#ffffff">
    <center>Hi, <?php echo $_COOKIE["user_cookie"] ?>, you will be redirected to your game server (<?php echo $_COOKIE["server_cookie"] ?>) shortly...</a>
    </center>
  </body>
</html>




 