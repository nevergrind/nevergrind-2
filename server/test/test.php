<style>
	html {
		font-size: 2rem;
	}
</style>
<script src="/ng2/js/libs/autobahn-2.min.js"></script>
<script>

var socketUrl = location.hostname === 'localhost' ?
	'ws://127.0.0.1:9090' : 'ws://ec2-34-220-110-228.us-west-2.compute.amazonaws.com:9090/';
var connection = new autobahn.Connection({
	url: socketUrl,
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
		obj.time *= 1000;
		console.log("Event:", arr, new Date(obj.time));
		var el = document.createElement('div');
		el.innerHTML = 'socket pushed at ' + new Date(obj.time);
		document.body.appendChild(el);
	});
}

</script>
<?php
require_once '../session/start.php';
echo '__DIR__ ' . __DIR__ . '<br>';
echo '$_SERVER[\'DOCUMENT_ROOT\']' . $_SERVER['DOCUMENT_ROOT'] . '<br>';
$now = microtime(true);

require '../db.php';

if ($result = mysqli_query($db, 'SELECT row FROM `accounts`')) {
	$count = mysqli_num_rows($result);
	echo 'Total accounts in the account table: ' . $count . '<br>';
}

$val = 5;
// session get/set test
$apcStart = microtime(true);
for ($i = 0; $i < 1e4; $i++) {
	$_SESSION['val'] = $val;
	$bar = $_SESSION['val'];
}
$apcEnd = microtime(true) - $apcStart;
echo '<br>$_SESSION primitive set & get test x10000:<br> ' . $apcEnd . '<br>';

// primitive apcu test
$apcStart = microtime(true);
for ($i = 0; $i < 1e4; $i++) {
	apcu_store('test', $val);
	$bar = apcu_fetch('test');
}
$apcEnd = microtime(true) - $apcStart;
echo '<br>APCu primitive set & get test x10000:<br> ' . $apcEnd . '<br>';

// object apcu test
$obj = [
	'name' => 'Bob',
	'age' => 35,
	'class' => 'Ranger',
	'isCool' => true,
	'level' => 50
];
$apcStart = microtime(true);
for ($i = 0; $i < 1e4; $i++) {
	apcu_store('obj', json_encode($obj));
	$bar = json_decode(apcu_fetch('obj'), true);
}
$apcEnd = microtime(true) - $apcStart;
echo '<br>APCu object set & get test x 10000:<br> ' . $apcEnd . '<br>';
echo '<pre>' . print_r($bar, true) . '</pre>';


$loops = 1;
// start push loop
$zmqStart = microtime(true);
for ($i = 0; $i < $loops; $i++) {
	require '../zmq.php';
	zmqSend('test', [
		'time' => microtime(true)
	]);
}
$zmqEnd = microtime(true) - $zmqStart;
echo '<br>zmq push test x 1:<br> ' . $zmqEnd . '<br>';


$zmqStart = microtime(true);
$client = new \Thruway\Peer\Client('realm1');
$client->setAttemptRetry(false);
$client->addTransportProvider(new \Thruway\Transport\PawlTransportProvider('ws://127.0.0.1:9090'));
$client->on('open', function (\Thruway\ClientSession $clientSession) {
	global $loops;
    for ($i = 0; $i < $loops; $i++) {
        $clientSession->publish('test',
			['$client push'],
			['time' => microtime(true)]
		);
    }
    $clientSession->close();
});
$client->start();
$zmqEnd = microtime(true) - $zmqStart;
echo '<br>zmq push test x ' . $loops .':<br> ' . $zmqEnd . '<br>';


$time = microtime(true) - $now;
echo '<br><br>';
echo 'This script took '. $time .' seconds to complete!';


exit;

/*
use GuzzleHttp\Client;
use Steam\Configuration;
use Steam\Runner\GuzzleRunner;
use Steam\Runner\DecodeJsonStringRunner;
use Steam\Steam;
use Steam\Utility\GuzzleUrlBuilder;*/

$steam = new Steam(new Configuration([
	Configuration::STEAM_KEY => 'cd221eb1bc1da0df4dbb9260c9865fe649117f70dcd636c1e92059e1286fe2e0'
]));
$steam->addRunner(new GuzzleRunner(new Client(), new GuzzleUrlBuilder()));
$steam->addRunner(new DecodeJsonStringRunner());

/** @var array $result */
$result = $steam->run(new \Steam\Command\Apps\GetAppList());

var_dump($result);