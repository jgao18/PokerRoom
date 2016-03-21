<?php
function logout_sess() {
    $_SESSION = [];
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 86400, $params['path'], $params['domain'],
        $params['secure'], $params['httponly']);
    session_destroy();
    header('Location: login.php');
    exit;
}