<?php
	$t1 = microtime(1);
	require_once('connect1.php');
	// total ng characters
	echo '<h2>Nevergrind</h2>';
	$result = mysqli_query($link, 'SELECT count(row) count FROM `accounts`');
	while ($row = mysqli_fetch_assoc($result)) {
		echo 'Nevergrind Accounts: ' . $row['count'] . '<br>';
	}
	$result = mysqli_query($link, 'SELECT count(row) count FROM `accounts` where confirmed=1');
	while ($row = mysqli_fetch_assoc($result)) {
		echo 'Nevergrind Accounts Confirmed: ' . $row['count'] . '<br>';
	}
	echo '<br>';
	$result = mysqli_query($link, 'SELECT count(row) count, accountType FROM `accounts` group by accountType');
	echo 'Nevergrind account types: <br>';
	while ($row = mysqli_fetch_assoc($result)) {
		echo 'Nevergrind account types: ' . $row['count'] . ' ' . $row['accountType'] . '<br>';
	}
	echo '<br>';
	// SELECT count(row) count, job FROM `characters` group by job
	echo 'Nevergrind character classes: <br>';
	$result = mysqli_query($link, 'SELECT count(row) total FROM characters');
	while ($row = mysqli_fetch_assoc($result)) {
		echo 'Nevergrind total characters: ' . $row['total'] . '<br>';
	}
	$result = mysqli_query($link, 'SELECT count(row) count, job FROM `characters` group by job');
	while ($row = mysqli_fetch_assoc($result)) {
		echo 'Nevergrind class: ' . $row['count'] . ' ' . $row['job'] . '<br>';
	}
	echo '<br>';
	// SELECT count(row) count, job FROM `characters` group by job
	$result = mysqli_query($link, 'SELECT sum(amount) revenue FROM `purchases`');
	while ($row = mysqli_fetch_assoc($result)) {
		echo 'Nevergrind revenue: $' . ($row['revenue']/100) . '<br>';
	}
	echo '<br>';
	// SELECT count(row) count, job FROM `characters` group by job
	$result = mysqli_query($link, 'SELECT row, created, timestamp, account from accounts where timestamp > date_sub(now(), interval 1 day)');
	echo 'Nevergrind online players: <br>';
	$count = 0;
	$str = '';
	while ($row = mysqli_fetch_assoc($result)) {
		echo 'Nevergrind character: '; echo var_export($row); echo '<br>';
		$count++;
	}
	echo '<b>Total online in the last 24 hours: ' . $count .'</b><br>';
	echo '////////////////////////////////////////////////////';
	echo '<h2>Nevergrind 2</h2>';
	// total ng2 characters
	$result = mysqli_query($link, 'SELECT count(row) count FROM `ng2_chars`');
	while ($row = mysqli_fetch_assoc($result)) {
		echo 'Nevergrind 2 Characters: ' . $row['count'] . '<br>';
	}
	// SELECT count(row) count, job FROM `characters` group by job
	$result = mysqli_query($link, 'SELECT count(row) count, job FROM `ng2_chars` group by job');
	echo 'Nevergrind 2 character classes: <br>';
	while ($row = mysqli_fetch_assoc($result)) {
		echo 'Nevergrind 2 class: ' . $row['count'] . ' ' . $row['job'] . '<br>';
	}

	echo '////////////////////////////////////////////////////';
	echo '<h2>Firmament Wars</h2>';
	// total fw nations
	$result = mysqli_query($link, 'SELECT count(row) count FROM `fwnations`');
	while ($row = mysqli_fetch_assoc($result)) {
		echo 'Firmament Wars Nations: ' . $row['count'] . '<br>';
	}




	$diff = microtime(1) - $t1;
	echo 'Execution time: ' . $diff;