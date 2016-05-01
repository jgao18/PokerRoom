<form action="<?= $_SERVER['PHP_SELF']; ?>" method="post">
    <input type="submit" name="back" value="Back"/>
    <?php if (isset($_POST['back'])) {
    header('Location: lobby.php');
    exit;
    }
 ?>
</form>
