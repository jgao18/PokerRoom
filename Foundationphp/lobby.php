<?php include("header.php"); ?>
<?php include ("authenticate.php"); ?>

      
<div id="main">
  <div id="navigation">
    &nbsp;
  </div>
  <?php include "logout_button.php"; ?>
  <div id="page">
    <h2>Main Menu</h2>
    <p>Hi, <?= htmlentities($_SESSION['username']); ?></p>

    <p>Welcome to Home Screen.</p>
    <ul>
      <li><a href="../client/index.html">Play Poker</a></li>
      <li><a href="">How to Play</a></li>
     

    </ul>
  </div>
</div>


