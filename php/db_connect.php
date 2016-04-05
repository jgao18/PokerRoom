<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=csci3300_poker', 'csci3300_poker', '8duK8rat2ehuyedR');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    $error = $e->getMessage();
}