<?php include("header.php"); ?>
<?php include("db_connect.php"); ?>
<?php require_once ("authenticate.php"); ?>
<?php session_start(); ?>


<?php
  $username = $_SESSION['username'];
  $sql = 'SELECT chipamount FROM users WHERE username = :username';
  $stmt = $db->prepare($sql);
  $stmt->bindParam(':username', $username);
  $stmt->execute();
  $stored = $stmt->fetchColumn();
  
  setcookie("user_cookie", $username , time() + (86400 * 30), "/");
  setcookie("chip_cookie", $stored , time() + (86400 * 30), "/"); 

?>
        
<div id="main">
  <div id="navigation">
    &nbsp;
  </div>
  <?php include "logout_button.php"; ?>
  <div id="page">
    <h2>Main Menu</h2>
    <p>Welcome to the Poker Room, <?= htmlentities($_SESSION['username']); ?>!</p>
       <p> You have $<?= htmlentities($stored); ?> on your account.</p>

   <ul>
      <li><a href="../php/holdemRooms.php">Texas Hold'em Rooms</a></li>     
    </ul>
  </div>
</div>


