<?php
require_once '../session/start.php';
session_destroy();
echo 'Session destroyed!';