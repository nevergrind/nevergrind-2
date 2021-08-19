<?php
$val = apcu_fetch('crypt-' . $_SESSION['account']);
if ($val !== $_POST['crypt']) {
	header('HTTP/1.1 500 Encryption Error');
	exit;
}