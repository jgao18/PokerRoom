<?php include("header.php"); ?>
<?php include ("authenticate.php"); ?>

      
<div id="main">
  <div id="navigation">
    &nbsp;
  </div>
  <?php include "logout_button.php"; ?>
  <div id="page">
    <h2>Main Menu</h2>
    <p>Welcome to the Poker Room, <?= htmlentities($_SESSION['username']); ?>!</p>
    <ul>
      <li><a href="../Foundationphp/holdemRooms.php">Texas Hold'em Rooms</a></li>     
    </ul>
  </div>
</div>


