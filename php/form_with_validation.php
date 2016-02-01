<?php
	require_once("validation_functions.php");
	
	$errors = array();
	$message = "";
	
	if (isset($_POST['submit'])) {
		// form was submitted
		$username = trim($_POST["username"]);
		$password = trim($_POST["password"]);

		// Validations
		$fields_required = array("username", "password");
		foreach($fields_required as $field) {
			$value = trim($_POST[$field]);
			if (!has_presence($value)) {
				$errors[$field] = ucfirst($field) . " can't be blank";
			}
		}
		
		$fields_with_max_lengths = array("username" => 30, "password" => 8);
		validate_max_lengths($fields_with_max_lengths);
		
		if (empty($errors)) {
			// try to login
			if ($username == "poker" && $password == "1234") {
				// successful login
				redirect_to("poker.html");
			} else {
				$message = "Username/password do not match.";

			}
		}

	} else {
		$username = "";
		$message = "Please log in.";
	}
?>

