<?php
require_once(__DIR__ . "/elephant.io-master/src/Client.php");
require_once(__DIR__ . "/elephant.io-master/src/EngineInterface.php");
require_once(__DIR__ . "/elephant.io-master/src/AbstractPayload.php");
require_once(__DIR__ . "/elephant.io-master/src/Exception/SocketException.php");
require_once(__DIR__ . "/elephant.io-master/src/Exception/MalformedUrlException.php");
require_once(__DIR__ . "/elephant.io-master/src/Exception/ServerConnectionFailureException.php");
require_once(__DIR__ . "/elephant.io-master/src/Exception/UnsupportedActionException.php");
require_once(__DIR__ . "/elephant.io-master/src/Exception/UnsupportedTransportException.php");

require_once(__DIR__ . "/elephant.io-master/src/Engine/AbstractSocketIO.php");
require_once(__DIR__ . "/elephant.io-master/src/Engine/SocketIO/Session.php");
require_once(__DIR__ . "/elephant.io-master/src/Engine/SocketIO/Version0X.php");
require_once(__DIR__ . "/elephant.io-master/src/Engine/SocketIO/Version1X.php");
require_once(__DIR__ . "/elephant.io-master/src/Payload/Decoder.php");
require_once(__DIR__ . "/elephant.io-master/src/Payload/Encoder.php");
?>