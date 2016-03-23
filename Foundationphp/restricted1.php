<?php
require_once ("authenticate.php");
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Restricted Page</title>
    <link href="css/styles.css" rel="stylesheet" type="text/css">
</head>

<body>
<h1>Restricted Page</h1>
<?php include 'logout_button.php'; ?>
<p>Hi, <?= htmlentities($_SESSION['username']); ?></p>
<p><a href="restricted2.php">Go to page 2</a></p>
</body>
</html>