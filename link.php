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
if (strpos($server, 'http://192.168.1.101:') !== FALSE) {
  $client = new Client(new Version1X($server)); // This does not like it if you include the backslash at the end of the address!

  $client->initialize();
  $client->emit('linkUsername', [$username, $chipAmount]);
  $client->emit('linkChipAmount', [$chipAmount]);
  $client->emit('disconnectLink', []);
  $client->close();

}
?>

<script>
    window.open("<?php echo $_COOKIE["server_cookie"] ?>", '_blank','width=680,height=680');
</script>
