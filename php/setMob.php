<?php
session_start();
$name = $_POST['name'];
$Slot = $_POST['Slot']*1;
$exp = $_POST['exp']*1;
$gold = $_POST['gold']*1;
// set mob values
$_SESSION['mob'][$Slot]->name = $name;
$_SESSION['mob'][$Slot]->exp = $exp;
$_SESSION['mob'][$Slot]->gold = $gold;
echo $_SESSION['mob'][$Slot]->exp;