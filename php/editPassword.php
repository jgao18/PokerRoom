<?php
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

<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Change Password</title>
    <link href="css/styles.css" rel="stylesheet" type="text/css">
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