<?php 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use ElephantIO\Client, ElephantIO\Engine\SocketIO\Version1X;

require __DIR__ . '/autoload.php';

$username = $_COOKIE["user_cookie"];

$client = new Client(new Version1X('http://192.168.1.97:3000'));
$client->initialize();
$client->emit('broadcast', [$username]);
$client->close();

echo 'tryin to send `bar` to the event `foo`';
//192.168.1.97:3000
?>

<html>
  <head>
    <title>Poker Room Redirect</title>
    <META http-equiv="refresh" content="20;URL=<?php echo $_COOKIE["server_cookie"]?>" >
  </head>
  <body bgcolor="#ffffff">
    <center>Hi, <?php echo $_COOKIE["user_cookie"] ?>, you will be redirected to your game server shortly...</a>
    </center>
  </body>
</html>




 