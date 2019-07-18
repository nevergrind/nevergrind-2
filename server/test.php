<style>
	html {
		font-size: 2rem;
	}
</style>
<link rel="shortcut icon" href="#">
<script src="/ng2/js/autobahn-2.min.js"></script>
<script>

var connection = new autobahn.Connection({
	url: 'ws://ec2-34-220-110-228.us-west-2.compute.amazonaws.com:9090/',
	realm: 'realm1'
});
connection.onopen = onOpen;
console.info('connection instantiated...');
connection.open();
//////////////////////////////////////
function onOpen(session) {
	console.warn("Connection successful!", session);
	session = session;

	session.subscribe('test', function(arr, obj){
		console.log("Event:", arr, obj);
		var el = document.createElement('div');
		el.innerHTML = 'socket reported: ' + arr[0];
		document.body.appendChild(el);
	});
	session.publish('test', ['Hello, earth!'], {
		date: Date.now()
	}, {
		exclude_me: false
	});
	// call/register example
	/*function add2(args) {
		return args[0] + args[1];
	}

	session.register('com.myapp.add2', add2);
	session.call('com.myapp.add2', [2, 3]).then(callDone);
	function callDone(res) {
		console.log("Result:", res);
	}*/
}

</script>
<?php
	session_start();
	$now = microtime(true);

	$date = date("D M d, Y G:i");
	$rand = mt_rand(0, 100);
	echo 'Date/Time: '. $date . '<br>';
	echo 'Microtime: '. microtime(true) . '<br>';
	echo 'Your random number from 1-100 is: '. $rand . '<br>';
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

	if ($result = mysqli_query($link, 'SELECT row FROM `accounts`')) {
		$count = mysqli_num_rows($result);
		echo 'Total accounts in the account table: ' . $count . '<br>';
	}
	// memcached check
	/*$memcache = new Memcache();
	$memcache->connect('127.0.0.1', 11211);
	$memcache->set('time', time());
	$cacheVal = $memcache->get($key);
	echo 'Cached value: ' . $cacheVal . '<br>';*/


	// primitive apcu test
	$val = 5;
	$apcStart = microtime(true);
	for ($i = 0; $i < 1e4; $i++) {
		apcu_store('test', $val);
		$bar = apcu_fetch('test');
	}
	$apcEnd = microtime(true) - $apcStart;
	echo '<br>APCu primitive set & get test x10000: ' . $apcEnd . '<br>';

	// object apcu test
	$obj = [
		'name' => 'Bob',
		'age' => 35,
		'class' => 'Ranger'
	];
	$apcStart = microtime(true);
	for ($i = 0; $i < 1e4; $i++) {
		apcu_store('obj', json_encode($obj));
		$bar = json_decode(apcu_fetch('obj'));
	}
	$apcEnd = microtime(true) - $apcStart;
	echo '<br>APCu object set & get test x 10000: ' . $apcEnd . '<br>';


	$time = microtime(true) - $now;
	echo 'session:<br>';
	echo var_export($_SESSION);
	echo '<br><br>';
	echo 'This script took '. $time .' seconds to complete!';
	exit;


	use GuzzleHttp\Client;
	use Steam\Configuration;
	use Steam\Runner\GuzzleRunner;
	use Steam\Runner\DecodeJsonStringRunner;
	use Steam\Steam;
	use Steam\Utility\GuzzleUrlBuilder;

	$steam = new Steam(new Configuration([
    	Configuration::STEAM_KEY => 'cd221eb1bc1da0df4dbb9260c9865fe649117f70dcd636c1e92059e1286fe2e0'
	]));
	$steam->addRunner(new GuzzleRunner(new Client(), new GuzzleUrlBuilder()));
	$steam->addRunner(new DecodeJsonStringRunner());

	/** @var array $result */
	$result = $steam->run(new \Steam\Command\Apps\GetAppList());

	var_dump($result);

	/*
	$_SESSION['ng2']['hp'] = 1;
	if ($_SESSION['ng2']['mp']) {
		$_SESSION['ng2']['mp'] = 1;
	}
	*/

	echo '<pre>HP: '. $_SESSION['ng2']['hp'] .'</pre>';
	echo '<pre>MP: '. $_SESSION['ng2']['mp'] .'</pre>';
	echo '<pre>hpRegen: '. $_SESSION['ng2']['hpRegen'] .'</pre>';
	$name = "DRAGONSOD''d fs 'fds df ds fds";
	$arr = explode(" ", $name);
	foreach ($arr as $key => &$value){
		$arr[$key] = strtolower($value);
		if ($value === 'of' || $value === 'the') {
			// do nothing
		}
		else {
			$arr[$key] = ucfirst($value);
		}
	}
	$formattedName = join(" ", $arr);
	echo "FORMATTED: ". $formattedName .'<br>';
	if (!ctype_alpha($formattedName)){
		echo '<br>This name contains illegal characters!<br>';
	}
	// AM I IN A PARTY
	$stmt = $link->prepare('SELECT count(row) count FROM `parties` where c_id=?');
	$stmt->bind_param('s', $_SESSION['ng2']['row']);
	$stmt->execute();
	$stmt->bind_result($dbCount);
	$inParty = 0;
	while ($stmt->fetch()) {
		$inParty = $dbCount;
	}
	echo "inParty: ". $inParty .'<br>';

	$stmt = $link->prepare('select name from `guilds` where name=?');
	$stmt->bind_param('s', $formattedName);
	$stmt->execute();
	$stmt->bind_result($formattedName);
	$stmt->store_result();
	$count = $stmt->num_rows;
	echo "COUNT: ". $count .'<br>';

	echo 'DIFF: '. (time() - $_SESSION['ng2']['played']) .'<br>';


	// echo '<pre>$_SESSION '; var_dump($_SESSION); echo '</pre>';

	echo '$_SESSION["email"] '. $_SESSION["email"] .'<br>';
	echo '$_SESSION["account"] '. $_SESSION["account"] .'<br>';
	echo '$_SESSION["ng2"]["row"] '. $_SESSION["ng2"]['row'] .'<br>';
	// details object data
	echo '<pre>$_SESSION[account]'; var_dump($_SESSION['account']); echo '</pre>';
	echo '<pre>$_SESSION[ng2]'; var_dump($_SESSION['ng2']); echo '</pre>';

	echo '<pre>$_SESSION[party]'; var_dump($_SESSION['party']); echo '</pre>';
	echo '<pre>$_SESSION[guild] '; var_dump($_SESSION['guild']); echo '</pre>';

	echo '<pre>$_SESSION[quest] '; var_dump($_SESSION['quest']); echo '</pre>';

	echo '<pre>$_SESSION[timers]: '; var_dump($_SESSION['timers']); echo '</pre>';
	$test = [
		//'id' => 5
	];

	if (empty($test)) {
		echo "<br>IT IS EMPTY!";
	}
	else {
		echo "<br>IT IS NOT EMPTY!";
	}
	if (!$_SESSION['party']['id']) {
		echo "<br>party IS EMPTY!";
	}
	else {
		echo "<br>party IS NOT EMPTY!";
	}

	if (isset($test)) {
		echo "<br>IT IS SET!";
	}
	else {
		echo "<br>IT IS NOT SET!";
	}

	exit;
	echo '-->'. $pos .'<br><br>';
	if ($pos === false){
		echo 'NOT found '. $findme;
	} else {
		echo 'found '. $findme;
	}
	
	$arr = [0,5,10];
	
	foreach ($arr as $value){
		echo '<br>'. $value;
	}
	
	if ($_SERVER["SERVER_NAME"] === "localhost x"){
		require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
		
		
		require 'item/baseItem.php';
		$item = baseItem();
		// 24 items
		$r = [];
		$r['row'] = 2;
		$r['name'] = 'Maelfyn';
		
		function itemLoop($loops){
			global $item, $r;
			$s = '';
			for ($i = 0; $i < $loops; $i++){
				if ($i > 0){
					$s .= '(';
				}
				$s .= $r['row'] .',?,"item",'. $i .',0';
				if ($i+1 < $loops){
					$s .= '),';
				}
			}
			return $s;
		}
		
		$queryValues = itemLoop(2);
		echo '<pre>$queryValues: '. $queryValues .'</pre>';
		
		$query = 'insert into `items` (
			charRow, 
			uniqueId, 
			slotType, 
			slot,
			lootRow
		) VALUES 
		('. $queryValues .')';
		
		$uniqueId = [
			$r['row'] . '-10',
			$r['row'] . '-11'
		];
		echo "<pre>uniqueId"; var_dump($uniqueId); echo "</pre>";
		$stmt = $link->prepare($query);
		$stmt->bind_param('ss', 
			$uniqueId[0], 
			$uniqueId[1]);
		$stmt->execute();
		
		echo "<pre>baseItem"; var_dump($item); echo "</pre>";
		
		
		
		require 'statMap.php';
		require 'getBaseMaxHp.php';
		require 'getBaseMaxMp.php';
		
		
		$f = [
			'level' => 50,
			'hp' => 0,
			'mp' => 0,
			'maxHp' => 0,
			'maxMp' => 0,
			'sta' => 155,
			'intel' => 200,
			'race' => 'Dwarf',
			'job' => 'Druid'
		];
		$f['hp'] = $f['maxHp'] = getBaseMaxHp($f);
		echo '<pre>$hp: '. $f['hp'] .' '. $f['maxHp'] .'</pre>';
		$f['mp'] = $f['maxMp'] = getBaseMaxMp($f);
		echo '<pre>$mp: '. $f['mp'] .' '. $f['maxMp'] .'</pre>';
		
		require 'create/addStartingSkills.php';
		addStartingSkills($f);
		echo "<pre>addStartingSkills"; var_dump($f); echo "</pre>";
		
		$query = "select row from `characters` where account=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_SESSION['account']);
		$stmt->execute();
		$stmt->store_result();
		$count = $stmt->num_rows;
		$totalCharacters = 0;
		if($count > 0){
			$totalCharacters = $count;
		}
		echo '<pre>CHARACTERS: '. $totalCharacters .'</pre>';
		
		
		require 'getResist.php';
		require 'getDungeonSkill.php';
		$_SESSION['hero'] = [
			'hp' => 50,
			'race' => 'Wood Elf',
			'job' => 'Ranger',
			'gender' => 'Male'
		];
		$resist = getResist('cold', $_SESSION['hero']);
		echo "<pre>Resist: "; echo $resist; echo "</pre>";
		
		$resist = getDungeonSkill('treasure', $_SESSION['hero']);
		echo "<pre>Skill: "; echo $resist; echo "</pre>";
		
		$attrs = array_keys($statMap[$f['race']]['attrs']);
		$baseAttrs = $statMap[$f['race']]['attrs'];
		$i = 0;
		foreach ($statMap['jobs'][$f['job']] as $value) {
			$baseAttrs[$i++] += $value;
		}
		
		echo "<pre>"; var_dump($baseAttrs); echo "</pre>";
		
		$t = 0;
		$i = 0;
		foreach ($baseAttrs as $value){
			$t += $baseAttrs[$i++];
		}
		echo '<pre>TOTAL: '. $t .'</pre>';
		
		echo "<pre>"; var_dump($statMap); echo "</pre>";
		
		exit;
	}
	