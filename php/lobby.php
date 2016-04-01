<?php include("header.php"); ?>
<?php include ("authenticate.php"); ?>
<?php include("db_connect.php"); ?>

<div id="main">
  <div id="navigation">
    &nbsp;
  </div>
  <?php include "logout_button.php"; ?>
  <div id="page">
    <h2>Main Menu</h2>
    <p>Welcome to the Poker Room, <?= htmlentities($_SESSION['username']); ?>!</p>
       <p> You have $<?= htmlentities($_POST['chipamount']); ?> on your account.</p>

   <ul>
      <li><a href="../php/holdemRooms.php">Texas Hold'em Rooms</a></li>     
    </ul>
  </div>
</div>


