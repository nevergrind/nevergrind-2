<?php
// primitive object test
$loops = 10000;
$apcStart = microtime(true);
for ($i = 0; $i < $loops; $i++) {
	$obj = apcu_fetch('obj' . $i);
}
$apcEnd = microtime(true) - $apcStart;
echo '<br>APCu object set & get test x '. $loops .':<br> ' . $apcEnd . '<br>';
echo '<pre>$obj ' . print_r($obj, true) . '</pre>';
