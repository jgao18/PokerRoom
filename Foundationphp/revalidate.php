<?php
include ("authenticate.php");
include ("logout_sess.php");
include ("AutoLogin.php");

//use Foundationphp\Sessions\AutoLogin;

if (!isset($_SESSION['invalid'])) {
    $_SESSION['invalid'] = 0;
}
$max_attempts = 2;

if (isset($_POST['revalidate'])) {
    $username = trim($_POST['username']);
    $pwd = trim($_POST['pwd']);
    $stmt = $db->prepare('SELECT pwd FROM users WHERE username = :username');
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $stored = $stmt->fetchColumn();
    if (password_verify($pwd, $stored)) {
        session_regenerate_id(true);
        $_SESSION['revalidated'] = true;
        unset($_SESSION['invalid']);
        header('Location: ' . $_SESSION['return_to']);
        exit;
    } else {
        $error = 'Incorrect username or password';
        $_SESSION['invalid']++;
        if ($_SESSION['invalid'] == $max_attempts) {
            if(isset($_SESSION['remember']) || isset($_SESSION['lynda_auth'])) {
                $autologin = new AutoLogin($db);
                $autologin->logout();
            }
            logout_sess();
        }
    }
}
?>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Revalidation</title>
    <link href="css/styles.css" rel="stylesheet" type="text/css">
</head>
<body>
<h1>Please Confirm Your Identity</h1>
<?php
if (isset($error)) {
    echo "<p>$error</p>";
}
?>
<form method="post">
    <p><label for="username">Username: </label>
        <input type="text" name="username">
    </p>
    <p><label for="pwd">Password: </label>
        <input type="password" name="pwd">
    </p>
    <p><input type="submit" name="revalidate" id="revalidate" value="Submit"></p>
</form>
</body>
</html>
