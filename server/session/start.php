<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
apcu_store('crypt-' . $_SESSION['account'], $_POST['id']);