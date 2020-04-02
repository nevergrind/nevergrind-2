<?php
require 'header.php';
require 'db.php';

// steam data if applicable
$version = '2020.1.1';
if ($_POST['version'] !== $version) {
	exit("Firmament Wars is currently being upgraded. We'll be right back!");
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
	$key = '98714A473D3003BDB1C90742087B3386';
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
	$stmt = $db->prepare("select account, steamid from accounts where steamid=?");
	$stmt->bind_param('s', $json->steamid);
	$stmt->execute();
	$stmt->store_result();

	if ($stmt->num_rows){
		// found an account.. is it mine?
		$stmt->bind_result($dbAccount, $dbSteamid);
		$db_account = null;
		$db_steamid = '';
		while ($stmt->fetch()){
			// account name conflict - enter an account name
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
				$_SESSION['account'] = $db_account;
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
		$_SESSION['account'] = $screenName;
		$r['isNewAccount'] = 1;
	}
}

// game data
if (isset($_SESSION['account'])) {
	$r['id'] = $_SESSION['account'];
	require 'create/load-all-characters.php';
}


echo json_encode($r);