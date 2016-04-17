<?php
require_once ("authenticate.php");
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Sensitive Information</title>
    <link href="css/styles.css" rel="stylesheet" type="text/css">
</head>

<body>
<?php
if (isset($_SESSION['revalidated'])) { ?>
    <h1>Sensitive Page</h1>
    <?php include 'logout_button.php'; ?>
    <p>Hi, <?= htmlentities($_SESSION['username']); ?>. Did you want to change your account details?</p>
    <p><a href="restricted2.php">Go to page 2</a></p>
<?php } else {
    $_SESSION['return_to'] = $_SERVER['PHP_SELF'];
    header('Location: revalidate.php');
    exit;
} ?>
</body>
</html>