<?php
	define("DB_SERVER", "localhost");
	define("DB_USER","csci3300_poker");
	define("DB_PASS","8duK8rat2ehuyedR");
	define("DB_NAME", "csci3300_poker");

  // 1. Create a database connection
  $connection = mysqli_connect(DB_SERVER, DB_USER, DB_PASS, DB_NAME);
  // Test if connection succeeded
  if(mysqli_connect_errno()) {
    die("Database connection failed: " . 
         mysqli_connect_error() . 
         " (" . mysqli_connect_errno() . ")"
    );
  }
?>
