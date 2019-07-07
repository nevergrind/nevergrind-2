<?php
	require_once('connect1.php');
	function chatInsert(){
		global $link;
		$msg = str_replace("|", "", $_POST['msg']);
		$nameFrom = $_POST['nameFrom'];
		$nameTo = $_POST['nameTo'];
		$class = $_POST['color']*1;
		$level = $_POST['level']*1;
		$job = $_POST['job']; 
		$email = $_SESSION['email'];
		if($email=='joemattleonard@gmail.com'||
		$email=='support@nevergrind.com'||
		$email=='jenlaurafinch@gmail.com'||
		$email=='ng@test.com'){
			$msg = strip_tags($msg, '<img><a><iframe><video><span>');
			$msg = str_replace("[b]", "<b>", $msg); 
			$msg = str_replace("[/b]", "</b>", $msg); 
			$msg = str_replace("[i]", "<i>", $msg); 
			$msg = str_replace("[/i]", "</i>", $msg); 
			$msg = str_replace("[u]", "<u>", $msg); 
			$msg = str_replace("[/u]", "</u>", $msg); 
			$msg = str_replace("[img]", "<img src='", $msg); 
			$msg = str_replace("[/img]", "'>", $msg); 
			if(strpos($msg, '[url]') !== false){
				$a = explode('[url]', $msg);
				$b = explode('[/url]', $a[1]);
				$msg = str_replace("[url]", "<a target='_blank' href='{$b[0]}'>", $msg); 
				$msg = str_replace("[/url]", "</a>", $msg); 
			}
		}else{
			if($nameTo!==''){
				$msg = strip_tags($msg, '<img><a><iframe><video><audio><span>');
			}else{
				$msg = strip_tags($msg, '<img><a>');
			}
			$msg = str_replace("[b]", "<b>", $msg); 
			$msg = str_replace("[/b]", "</b>", $msg); 
			$msg = str_replace("[i]", "<i>", $msg); 
			$msg = str_replace("[/i]", "</i>", $msg); 
			$msg = str_replace("[u]", "<u>", $msg); 
			$msg = str_replace("[/u]", "</u>", $msg); 
			$msg = str_replace("[img]", "<img src='", $msg); 
			$msg = str_replace("[/img]", "'>", $msg); 
			if(strpos($msg, '[url]') !== false){
				$a = explode('[url]', $msg);
				$b = explode('[/url]', $a[1]);
				$msg = str_replace("[url]", "<a target='_blank' href='{$b[0]}'>", $msg); 
				$msg = str_replace("[/url]", "</a>", $msg); 
			}
		}
		if($class==8){
			if($_SERVER["SERVER_NAME"] !== "localhost"){
				if($email=='joemattleonard@gmail.com'||
				$email=='support@nevergrind.com'){
					// ok!
				}else{
					$class = 6;
				}
			}
		}
		if($email=='joemattleonard@gmail.com'||
		$email=='support@nevergrind.com'||
		$email=='ng@test.com'){
			$GM = 1;
		}else{
			$GM = 0;
		}
		$query = "insert into chat (`GM`, `message`, `nameFrom`, `nameTo`, `class`, `level`, `job`) 
			values (?, ?, ?, ?, ?, ?, ?);";
		$stmt = $link->prepare($query);
		$stmt->bind_param('isssiis', $GM, $msg, $nameFrom, $nameTo, $class, $level, $job);
		$stmt->execute();
		
		$query = 'delete from chat where timestamp < date_sub(now(), interval 1 minute)';
		$stmt = $link->prepare($query);
		$stmt->execute();
		echo "";
	}
	call_user_func($_POST['run']);
?>