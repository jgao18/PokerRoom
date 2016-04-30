<?php include("db_connect.php");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (isset($_POST["user_data"])) {

  $dataString = $_POST["user_data"];
  
  $dataList = explode("~", $dataString);
  $username = $dataList[0];
  $chips = $dataList[1];
  
  $sql= 'UPDATE users SET chipamount=:chipamount WHERE username=:username';
  $stmt = $db->prepare($sql);
  $stmt->bindParam(':username', $username);
  $stmt->bindParam(':chipamount', $chips);
  $stmt->execute();
}
?>