<?php
	function hpRegen() {
		$val = 1 + ($_SESSION['level'] / 16) + ($_SESSION['sta'] / 50);
		return $val;
	}
	function mpRegen() {
		$val = $_SESSION['wis'] / 25;
		return $val;

	}
	$_SESSION['hpRegen'] = floor(hpRegen());
	$_SESSION['mpRegen'] = floor(mpRegen());