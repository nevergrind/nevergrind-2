<?php
$name = substr($name, 0, 30);
if (strlen($name) < 4){
	exit('This guild name is too short!');
}
// remove illegal characters - must be capitalized
$illegal = ["\\", "/", ":", "*", "?", '"', ">", "<", "1", "2", "3", "4", "5", "6", "7", "8", "9", "`", "0", "_"];
$name = str_replace($illegal, "", $name);
// apply standardized capitalization
$arr = explode(" ", $name);
foreach ($arr as $key => &$value){
	if ($value === 'of'
		|| $value === 'the'
		|| $value === 'and') {
		$arr[$key] = strtolower($value);
	}
	else {
		error_log('2 ' . $value);
		$arr[$key] = ucfirst($value);
	}
}

$name = join(" ", $arr);