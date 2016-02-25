<?php require_once("session.php"); ?>
<?php include("db_connection.php"); ?>
<?php include("functions.php"); ?>
<?php require_once("validation_functions.php"); ?>

  <?php
  
 $username = "";
  
  if (isset($_POST['submit'])) {
    // form was submitted

  // validations
  $required_fields = array("username", "password");
  validate_presences($required_fields);

    if (empty($errors)) {
       // Attempt Login

    $username = $_POST["username"];
    $password = $_POST["password"];

  $found_admin = attempt_login($username, $password);
    if ($found_admin) {
      // Success
      // Mark user as logged in
     // $_SESSION["admin_id"] = $found_admin["id"];
      $_SESSION["username"] = $username;
      redirect_to("lobby.php");
    } else {
      // Failure
      $_SESSION["message"] = "Username/password not found.";
    }
  }
} else {
    
} // end: if (isset($_POST['submit']))

?>
 