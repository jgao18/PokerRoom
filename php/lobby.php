<?php include("header3.php"); ?>
<?php include("db_connect.php"); ?>
<?php require_once ("authenticate.php"); ?>
<?php session_start(); ?>


<?php
//sql query to get chipamount from database
  $username = $_SESSION['username'];
  $sql = 'SELECT chipamount FROM users WHERE username = :username';
  $stmt = $db->prepare($sql);
  $stmt->bindParam(':username', $username);
  $stmt->execute();
  $stored = $stmt->fetchColumn();
  
  setcookie("user_cookie", $username , time() + (86400 * 30), "/");
  setcookie("chip_cookie", $stored , time() + (86400 * 30), "/"); 

?>
<style>
input[type=submit] {
    float: top;
    margin-right: 20px;
    margin-top: 20px;
    width: 90px;
    height: 30px;
font-size: 12px;
    font-weight: bold;
    color: #fff;
    background-color: #acd6ef; /*IE fallback*/
    background-image: -webkit-gradient(linear, left top, left bottom, from(#acd6ef), to(#6ec2e8));
    background-image: -moz-linear-gradient(top left 90deg, #acd6ef 0%, #6ec2e8 100%);
    background-image: linear-gradient(top left 90deg, #acd6ef 0%, #6ec2e8 100%);
    border: 1px solid #66add6;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .3), inset 0 1px 0 rgba(255, 255, 255, .5);
    cursor: pointer;
}</style>
        
<div id="main">
  <div id="navigation">
    &nbsp;
  </div>
  <div id="page">
    <h2>Main Menu</h2>
    <p>Welcome to the Poker Room, <?= htmlentities($_SESSION['username']); ?>!</p>
       <p> You have $<?= htmlentities($stored); ?> on your account.</p>

   <ul>
      <li><a href="../php/holdemRooms.php">Texas Hold'em Rooms</a></li>    
      <li><a href="../php/editPassword.php">Change Password</a></li>     

    </ul>
  </div>
</div>


