<?php
//require_once './includes/init.php';
//require_once './includes/logout_sess.php';
//include('./includes/init.php');
include ("logout_sess.php");
include ("AutoLogin.php");
include ("init.php");



if (isset($_POST['cancel'])) {
    header('Location: ' . $_SESSION['return_to']);
    exit;
}

//use Foundationphp\Sessions\AutoLogin;

if (isset($_POST['logout'], $_SESSION['remember']) || isset($_POST['logout'], $_SESSION['lynda_auth'])) {
?>
<!doctype html>
<html lang="en">
<head>
    <title>Logout</title>
    <meta charset="utf-8">
</head>
<body>
<h1>Log Out</h1>
<form action="<?= $_SERVER['PHP_SELF']; ?>" method="post">
    <p>
        <input type="submit" name="single" value="Don't remember me in this browser/computer">
        <input type="submit" name="all" value="Don't remember me on any computer">
    </p>
    <p>
        <input type="submit" name="cancel" value="Cancel">
    </p>
</form>
</body>
</html>
<?php
} elseif (isset($_POST['single']) || isset($_POST['all'])) {
    $autologin = new AutoLogin($db);
    if (isset($_POST['single'])) {
        $autologin->logout(false);
    } else {
        $autologin->logout(true);
    }
    logout_sess();
} elseif (isset($_POST['logout'])) {
    logout_sess();
}
