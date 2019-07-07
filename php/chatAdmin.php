<?php
	require_once('connect1.php');
	function chatBan(){
		global $link;
		$account = $_POST['account'];
		$query = 'update accounts set status="banned" where account=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $account);
		$stmt->execute();
		$query = "insert into ping (`account`) values (?)";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $account);
		$stmt->execute();
	}
	function chatSuspend(){
		global $link;
		$account = $_POST['account'];
		$query = 'update accounts set status="suspended" where account=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $account);
		$stmt->execute();
		$query = "insert into ping (`account`) values (?)";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $account);
		$stmt->execute();
	}
	function chatActive(){
		global $link;
		$account = $_POST['account'];
		$query = 'update accounts set status="active" where account=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $account);
		$stmt->execute();
	}
	if($_SESSION['email']=='joemattleonard@gmail.com'||
	$_SESSION['email']=='ng@test.com'||
	$_SESSION['email']=='support@nevergrind.com'){
		call_user_func($_POST['run']);
	}
?>