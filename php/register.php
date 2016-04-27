<?php
include('header.php');
$errors = [];
if (isset($_POST['register'])) {
    require_once ("db_connect.php");
    $expected = ['username', 'pwd', 'confirm'];
    // Assign $_POST variables to simple variables and check all fields have values
    foreach ($_POST as $key => $value) {
        if (in_array($key, $expected)) {
            $$key = trim($value);
            if (empty($$key)) {
                $errors[$key] = 'This field requires a value.';
            }
        }
    }
     if(strlen($username)>9){
        $errors['field_name']= ' Usernames must be less than 9 characters.';
    }
   
    // Proceed only if there are no errors
    if (!$errors) {
        if ($pwd != $confirm) {
            $errors['nomatch'] = 'Passwords do not match.';
        } else {
            // Check that the username hasn't already been registered
            $sql = 'SELECT COUNT(*) FROM users WHERE username = :username';
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            if ($stmt->fetchColumn() != 0) {
                $errors['failed'] = "$username is already registered. Choose another name.";
            } else {
                try {
                    // Generate a random 8-character user key and insert values into the database
                    $chipamount = 1000;
                    $user_key = hash('crc32', microtime(true) . mt_rand() . $username);
                    $sql = 'INSERT INTO users (user_key, username, pwd,chipamount,last_login)
                            VALUES (:key, :username, :pwd, :chipamount,NOW())';
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam(':key', $user_key);
                    $stmt->bindParam(':username', $username);
                    // Store an encrypted version of the password
                    $stmt->bindValue(':pwd', password_hash($pwd, PASSWORD_DEFAULT));
                    $stmt->bindParam(':chipamount', $chipamount);
                    $stmt->execute();
                } catch (\PDOException $e) {
                    if (0 === strpos($e->getCode(), '23')) {
                        // If the user key is a duplicate, regenerate, and execute INSERT statement again
                        $user_key = hash('crc32', microtime(true) . mt_rand() . $username);
                        if (!$stmt->execute()) {
                            throw $e;
                        }
                    }
                }
                // The rowCount() method returns 1 if the record is inserted,
                // so redirect the user to the login page
                if ($stmt->rowCount()) {
		    echo '<script type="text/javascript">'; 
                    echo 'alert("Your account was successfully created!");'; 
                    echo 'window.location.href = "login.php";';
                    echo '</script>';
                                          
                }
            }
        }
    }
}
?>
<!doctype html>
<html>
<head>

<style>
	html, body {
    width: 100%;
    height: 100%;
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    color: #444;
    -webkit-font-smoothing: antialiased;
    background: #f0f0f0;
}
form {
    margin: 0 auto;
    margin-top: 20px;
}
p a:hover {
    color: #555;
}
input {
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: 12px;
    outline: none;
}
input[type=text],
input[type=password] {
    color: #777;
    padding-left: 10px;
    margin: 10px;
    margin-top: 12px;
    margin-left: 18px;
    width: 290px;
    height: 35px;
	border: 1px solid #c7d0d2;
    border-radius: 2px;
    box-shadow: inset 0 1.5px 3px rgba(190, 190, 190, .4), 0 0 0 5px #f5f7f8;
-webkit-transition: all .4s ease;
    -moz-transition: all .4s ease;
    transition: all .4s ease;
	}
input[type=text]:hover,
input[type=password]:hover {
    border: 1px solid #b6bfc0;
    box-shadow: inset 0 1.5px 3px rgba(190, 190, 190, .7), 0 0 0 5px #f5f7f8;
}
input[type=text]:focus,
input[type=password]:focus {
    border: 1px solid #a8c9e4;
    box-shadow: inset 0 1.5px 3px rgba(190, 190, 190, .4), 0 0 0 5px #e6f2f9;
}
input[type=checkbox] {
    margin-left: 20px;
    margin-top: 30px;
}
.check {
    margin-left: 3px;
	font-size: 11px;
    color: #444;
    text-shadow: 0 1px 0 #fff;
}
input[type=submit] {
    float: center;
    margin-right: 20px;
    margin-top: 20px;
    width: 100px;
    height: 30px;
font-size: 12px;
    font-weight: bold;
    color: #fff;
    background-color: #acd6ef; /*IE fallback*/
    background-image: -webkit-gradient(linear, left top, left bottom, from(#acd6ef), to(#6ec2e8));
    background-image: -moz-linear-gradient(top left 90deg, #acd6ef 0%, #6ec2e8 100%);
    background-image: linear-gradient(top left 90deg, #acd6ef 0%, #6ec2e8 100%);
    border-radius: 30px;
    border: 1px solid #66add6;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .3), inset 0 1px 0 rgba(255, 255, 255, .5);
    cursor: pointer;
}
input[type=submit]:hover {
    background-image: -webkit-gradient(linear, left top, left bottom, from(#b6e2ff), to(#6ec2e8));
    background-image: -moz-linear-gradient(top left 90deg, #b6e2ff 0%, #6ec2e8 100%);
    background-image: linear-gradient(top left 90deg, #b6e2ff 0%, #6ec2e8 100%);
}
input[type=submit]:active {
    background-image: -webkit-gradient(linear, left top, left bottom, from(#6ec2e8), to(#b6e2ff));
    background-image: -moz-linear-gradient(top left 90deg, #6ec2e8 0%, #b6e2ff 100%);
    background-image: linear-gradient(top left 90deg, #6ec2e8 0%, #b6e2ff 100%);
}label {
    display: inline-block;
    width: 5em;
    text-align: right;
}
#create label {
    width: 10em;
}
label[for=remember] {
    width: auto;
}
label[for=color] {
    display: inline;
    width: auto;
    text-align: left;
}
#register {
    margin-left: 12.5em;
}
#revalidate {
    margin-left: 6.5em;
}
 </style>

<meta charset="utf-8">
<title>Create Account</title>
</head>

<body id="create">
<h1>Create Account</h1>
<form action="<?= $_SERVER['PHP_SELF']; ?>" method="post">
    <p>
        <label for="username">Username:</label>
        <input type="text" name="username" id="username"
        <?php
        if (isset($username) && !isset($errors['username'])) {
            echo 'value="' . htmlentities($username) . '">';
        } else {
            echo '>';
        }
        if (isset($errors['username'])) {
            echo $errors['username'];
        } elseif (isset($errors['failed'])) {
            echo $errors['failed'];
        }elseif(isset($errors['field_name'])){
            echo $errors['field_name'];
        }
        ?>
    </p>
    <p>
        <label for="pwd">Password:</label>
        <input type="password" name="pwd" id="pwd">
        <?php
        if (isset($errors['pwd'])) {
            echo $errors['pwd'];
        }
        ?>
    </p>
    <p>
        <label for="confirm">Confirm Password:</label>
        <input type="password" name="confirm" id="confirm">
        <?php
        if (isset($errors['confirm'])) {
            echo $errors['confirm'];
        } elseif (isset($errors['nomatch'])) {
            echo $errors['nomatch'];
        }
        ?>
    </p>
    <p>
        <input type="submit" name="register" id="register" value="Create Account">
    </p>
</form>
</body>
</html>