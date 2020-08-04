<?php
// for testing purposes only
require_once '../session/start.php';
if (session_status() == PHP_SESSION_ACTIVE) {
	session_destroy();
}
echo 'Session destroyed!';