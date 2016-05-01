<?php
include('header.php');
require_once ("AutoLogin.php");
require_once ("authenticate.php");
$errors = [];
if (isset($_POST['changepwd'])) {
    require_once ("db_connect.php");
    $expected = ['currentpwd', 'newpwd', 'confirm'];
    // Assign $_POST variables to simple variables and check all fields have values
    foreach ($_POST as $key => $value) {
        if (in_array($key, $expected)) {
            $$key = trim($value);
            if (empty($$key)) {
                $errors[$key] = 'This field requires a value.';
            }
        }
    }
    // Proceed only if there are no errors
    if (!$errors) {
        if ($newpwd != $confirm) {
            $errors['nomatch'] = 'Passwords do not match.';
        } else{
                   	$username=$_SESSION['username'];
                   	$currentpwd=$_POST['currentpwd'];
                	$pwd=$_POST['newpwd'];
                    $stmt = $db->prepare('SELECT pwd FROM users WHERE username = :username');
                    $stmt->bindParam(':username', $username);
                    $stmt->execute();
                    $stored = $stmt->fetchColumn();
                 if (password_verify($currentpwd, $stored)) {                
                 	  $sql = ('UPDATE users SET pwd =:pwd WHERE username = :username');
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam(':username', $username);
                    // Store an encrypted version of the password
                    $stmt->bindValue(':pwd', password_hash($pwd, PASSWORD_DEFAULT));
                     $stmt->execute();
     
                      header('Location: lobby.php');
                      exit;
                  
               }else{
        $error = 'Current password doesnot match.';
    
}
}
}
}          
              
               
    
?>
<div id="main">
  <div id="navigation">
    &nbsp;
  </div>
<div id="page">
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Change Password</title>
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
    width: 115px;
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

</head>

<body id="create">
<h1>Change Password</h1>
<?php
if (isset($error)) {
    echo "<p>$error</p>";
}
?>
<form action="<?= $_SERVER['PHP_SELF']; ?>" method="post">
    <p>
        <label for="currentpwd">Current Password:</label>
        <input type="password" name="currentpwd" id="currentpwd"
        <?php
        if (isset($currentpwd) && !isset($errors['currentpwd'])) {
            echo 'value="' . htmlentities($currentpwd) . '">';
        } else {
            echo '>';
        }
        if (isset($errors['currentpwd'])) {
            echo $errors['currentpwd'];
        } elseif (isset($errors['failed'])) {
            echo $errors['failed'];
        }
        ?>
    </p>
    <p>
        <label for="newpwd">New Password:</label>
        <input type="password" name="newpwd" id="newpwd">
        <?php
        if (isset($errors['newpwd'])) {
            echo $errors['newpwd'];
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
        <input type="submit" name="changepwd" id="changepwd" value="Change Password">
    </p>
</form>
</body>
</html>
</div>