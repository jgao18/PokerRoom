<?php
require_once 'authenticate.php';
if (isset($_POST['choose'])) {
    $_SESSION['color'] = $_POST['color'];
}
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
<p>Still here, <?= htmlentities($_SESSION['username']); ?>?</p>
<form action="<?= $_SERVER['PHP_SELF']; ?>" method="post">
    <label for="color">Select a color:</label>
    <select name="color" id="color">
        <option value="">Choose one</option>
        <option <?php
        if (isset($_SESSION['color']) && $_SESSION['color'] == 'Blue') {
            echo 'selected';
        }
        ?>>Blue</option>
        <option <?php
        if (isset($_SESSION['color']) && $_SESSION['color'] == 'Green') {
            echo 'selected';
        }
        ?>>Green</option>
        <option <?php
        if (isset($_SESSION['color']) && $_SESSION['color'] == 'Red') {
            echo 'selected';
        }
        ?>>Red</option>
    </select>
    <input type="submit" name="choose" value="Choose">
</form>
<p><a href="restricted1.php">Go to page 1</a></p>
<p><a href="sensitive.php">Change account details</a></p>
</body>
</html>