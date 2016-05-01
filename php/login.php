<?php
include ("init.php");
include ("header.php");

//check username and password
if (isset($_POST['login'])) {
    $username = trim($_POST['username']);
    $pwd = trim($_POST['pwd']);
    $stmt = $db->prepare('SELECT pwd FROM users WHERE username = :username');
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $stored = $stmt->fetchColumn();
    if (password_verify($pwd, $stored)) {
        session_regenerate_id(true);
        $_SESSION['username'] = $username;
        $_SESSION['authenticated'] = true;
        if (isset($_POST['remember'])) {
            // create persistent login
            $autologin = new AutoLogin($db);
            $autologin->persistentLogin();
        }
         //find the difference between current Date and last_login date
        $stmt=$db->prepare('SELECT DATEDIFF(NOW(),last_login) FROM users WHERE username=:username');
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $stored = $stmt->fetchColumn();
         //check the number of days    
            if($stored>0){
            $sql= 'UPDATE users SET chipamount=chipamount+100 WHERE username=:username';
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->execute();}
                    
          //update users current date 
        $sql= 'UPDATE users SET last_login=NOW() WHERE username=:username';
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':username', $username);
        $stmt->execute();         
        header('Location: lobby.php');
        exit;
    } else {
        $error = 'Login failed. Check username and password.';
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
<title>Auto Login</title>
    
    <center>
		<h1> User Login</h1>
	</center>
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
    width: 250px;
    height: 35px;
	border: 1px solid #c7d0d2;
   
    
-webkit-transition: all .4s ease;
    -moz-transition: all .4s ease;
    transition: all .4s ease;
	}
input[type=text]:hover,
input[type=password]:hover {
    border: 1px solid #b6bfc0;
    
}
input[type=text]:focus,
input[type=password]:focus {
    border: 1px solid #a8c9e4;
 
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

<body>

<?php
if (isset($error)) {
    echo "<p>$error</p>";
}
?>
<form action="<?= $_SERVER['PHP_SELF']; ?>" method="post">
   <p> <center>
        <label for="username">Username:</label>
        <input type="text" name="username" id="username">
        </center>
    </p>
    <p><center>
        <label for="pwd">Password:</label>
        <input type="password" name="pwd" id="pwd">
    
    </center>
    </p><center>
    <li><a href="register.php">Create an account</a></li></center>
        <p><center>
        <input type="submit" name="login" id="login" value="Log In">
        </center>
    </p>
</form>
</body>
</html>
</div>
