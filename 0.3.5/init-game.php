<?php
require 'header.php';
require 'db.php';

// steam data if applicable
$version = '0.3.5';
if ($_POST['version'] !== $version) {
	exit("Nevergrind Online is currently being upgraded. We'll be right back!");
	/*header('HTTP/1.1 Nevergrind Online is currently being upgraded. We\'ll be right back!');*/
}
$r['checkedSteam'] = 0;
$r['isNewAccount'] = 0;
$r['setAccountName'] = 0;

// account session not initialized and is Steam app
if (empty($_SESSION['account']) &&
	isset($_POST['screenName']) &&
	strlen($_POST['screenName']) > 0 &&
	strlen($_POST['steamId']) > 0 &&
	strlen($_POST['ticket']) > 0) {
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/config.php';
	// Steam
	$r['checkedSteam'] = 1;
	// try for Steam login
	// screenName is not trusted - must verify the account name does not exist
	// this value can change, so we'll just take what the client first saw it as
	$screenName = $_POST['screenName'];
	// we'll verify this matches what the ticket returns from the Steam API
	$steamid = $_POST['steamId'];
	// set options
	$url = 'https://api.steampowered.com/ISteamUserAuth/AuthenticateUserTicket/v1/';
	$key = $config['steamKey']; // no idea what this is
	$appId = '853450';
	// authenticate via steam API
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,
		$url. '?key='. $key .'&ticket='. $_POST['ticket'] .'&appid='. $appId
	);
	//return the transfer as a string
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

	// $output contains json result
	$output = curl_exec($ch);
	// close curl resource to free up system resources
	curl_close($ch);
	$json = json_decode($output);
	$json->steamid = $json->response->params->steamid;
	// is this equal to what the client thinks??? if so authenticate (and set screenName if applicable)
	$r['jsonSteamId'] = $json->steamid;
	$r['steamid'] = $steamid;

	if ($json->steamid !== $steamid) {
		exit("Unable to authenticate your credentials via Steam. Please try again later.");
	}

	// who owns this steamid?
	$stmt = $db->prepare("select row, account, steamid from accounts where steamid=?");
	$stmt->bind_param('s', $json->steamid);
	$stmt->execute();
	$stmt->store_result();

	if ($stmt->num_rows){
		// found an account.. is it mine?
		$stmt->bind_result($dbRow, $dbAccount, $dbSteamid);
		$dbRow = null;
		$db_account = null;
		$db_steamid = '';
		while ($stmt->fetch()){
			// account name conflict - enter an account name
			$db_row = $dbRow;
			$db_account = $dbAccount;
			$db_steamid = $dbSteamid;
		}
		if (is_null($db_account)) {
			// THIS SHOULD NEVER HAPPEN - some kind of account value should be there
			exit("Unable to initialize your Steam account. Contact us at support@neverworks.com");
		}
		else {
			// found an account name as expected
			if ($json->steamid === $_POST['steamId'] &&
				strlen($db_account) > 1) {
				// matches what the ticket returned and what was posted
				// account exists and matches static id - steam login SUCCESS!
				$_SESSION['account'] = $db_row;
			}
			else {
				exit("Unable to verify your Steam account.");
			}
		}
	}
	else {
		// no steamid found - NEW ACCOUNT
		// remove illegal characters from $screenName
		$screenName = str_replace('\\', "", $screenName);
		$screenName = substr(
			preg_replace(
				'/[^0-9A-z_-]/',
				'',
				$screenName
			),
			0,
			64
		);

		// length check - if too short change name to player
		if (strlen($screenName) < 2){
			// what the fuck is this?
			$screenName = 'p' . mt_rand(0, 727379969);
			$screenName = substr(
				preg_replace(
					'/[^0-9A-z_-]/',
					'',
					$screenName
				),
				0,
				64
			);
		}

		// check if account name is available
		$stmt = $db->prepare("select account from accounts where account=?");
		$stmt->bind_param('s', $screenName);
		$stmt->execute();
		$stmt->store_result();

		if ($stmt->num_rows > 0){
			$r['setAccountName'] = 1;
			// account exists - find a new screen name
			$newAccountName = '';
			while (strlen($newAccountName) === 0) {
				$suffix = 1;
				$check = $screenName . $suffix;
				$stmt = $db->prepare("select account from accounts where account=?");
				$stmt->bind_param('s', $check);
				$stmt->execute();
				$stmt->store_result();

				if (!$stmt->num_rows){
					$newAccountName = $check;
				}
			}
			// overwrite with new account name
			$screenName = $newAccountName;
		}
		// insert account into account table automatically
		$query = "insert into `accounts` (`account`, `steamid`) VALUES (?, ?)";
		$stmt = $db->prepare($query);
		$stmt->bind_param('ss', $screenName, $steamid);
		$stmt->execute();
		$_SESSION['account'] = mysqli_insert_id($db);
		$r['isNewAccount'] = 1;
	}
}


// game data
if (isset($_SESSION['account'])) {
	$r['id'] = $_SESSION['account'];
	require 'create/load-all-characters.php';
	$stmt = $db->prepare('update `accounts` set last_login=now() where row=?');
	$stmt->bind_param('i', $r['id']);
	$stmt->execute();

	// get bank slot data
	$stmt = $db->prepare('select character_slots, bank_slots from `accounts` where row=?');
	$stmt->bind_param('i', $_SESSION['account']);
	$stmt->execute();
	$stmt->store_result();
	$stmt->bind_result($characterSlots, $bankSlots);
	$r['bankSlots'] = 0;
	while ($stmt->fetch()){
		$r['characterSlots'] = $characterSlots;
		$r['bankSlots'] = $bankSlots;
	}
}
// socket
if ($_SERVER['SERVER_NAME'] !== 'localhost') {
	// prod
	$r['socketUrl'] = '34.220.110.228';
}
else {
	// local
	$r['socketUrl'] = '127.0.0.1';
}

echo json_encode($r);