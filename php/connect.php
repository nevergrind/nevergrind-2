<?php
	session_set_cookie_params(86400);
	ini_set('session.gc_maxlifetime', 86400);
	session_start();
	$host = $_POST['host'];
	
	if($_SERVER["SERVER_NAME"] === "localhost"){
		$link = mysqli_connect("localhost:3306","root","","nevergrind");
	}else{
		require $_SERVER['DOCUMENT_ROOT'] . '/ng2/php/values/dbpw.php';
		$link = mysqli_connect("localhost", "nevergri_ng", $dbpw, "nevergri_ngLocal");
	}
	
	if (!$link) {
		die('Could not connect: ' . mysqli_error());
	}
	// protocol
	$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
	
	// time
	date_default_timezone_set('UTC');
	$GLOBALS['date'] = date("Y-m-d");
	$GLOBALS['time'] = date("H:i:s");
	$GLOBALS['season'] = 1;
	$GLOBALS['myObject'] = "name, abjuration, agi, alteration, cha, championsSlain, channeling, conjuration, deaths, defense, dex, difficulty, dodge, doubleAttack, dualWield, epicQuests, escapes, evocation, exp, gender, gold, handtohand, hardcoreMode, hp, intel, job, kills, lastName, level, magicFound, maxHp, maxMp, mobsSlain, mp, offense, oneHandBlunt, oneHandSlash, parry, patch, piercing, playtime, quests, race, raresFound, riposte, setFound, sta, story, str, subzone, subzoneN, subzoneH, svcold, svfire, svlightning, svmagic, svpoison, talent1, talent2, talent3, talent4, talent5, talent6, talent7, talent8, talent9, talent10, talent11, talent12, title, totalGold, twoHandBlunt, twoHandSlash, uniquesFound, upgrades, wis, zone, zoneH, zoneN, comboMistmoore, comboLowerGuk, comboCazicThule, comboKedgeKeep, comboPermafrost, comboSolB, comboPlaneofHate, comboPlaneofFear";
	
	$GLOBALS['item'] = "abjuration, absorbCold, absorbFire, absorbLightning, absorbMagic, absorbPoison, agi, allResist, allSkills, allStats, alteration, armor, attack, castingHaste, cha, channeling, cold, coldDamage, conjuration, critChance, critDamage, damage, defense, delay, dex, dodge, doubleAttack, dualWield, enhanceAll, enhanceCold, enhanceFire, enhanceLightning, enhanceMagic, enhancePhysical, enhancePoison, enhancedArmor, enhancedDamage, evocation, expFind, fear, fireDamage, flavorText, globalHaste, goldFind, handtohand, haste, hp, hpKill, hpRegen, ias, intel, itemSlot, leech, lightRadius, lightningDamage, magMit, magicDamage, mp, mpKill, mpRegen, name, offense, oneHandBlunt, oneHandSlash, parry, phyMit, physicalDamage, piercing, poisonDamage, proc, quality, rarity, req, resistCold, resistFire, resistLightning, resistMagic, resistPoison, riposte, runSpeed, silence, sta, str, stun, thorns, twoHandBlunt, twoHandSlash, type, upgrade, weight, wis, wraith, xPos, yPos";
	
	$GLOBALS['quests'] = "bb1, bb2, bb3, bb4, befallen, bf1, bf2, bf3, bf4, blackburrow, castleMistmoore, cazicThule, cb1, cb2, cb3, cb4, cb5, cm1, cm2, cm3, cm4, cm5, cm6, crushbone, ct1, ct2, ct3, ct4, ct5, er1, er2, er3, er4, er5, estateOfUnrest, gf1, greaterFaydark, kedgeKeep, kk1, kk2, kk3, kk4, kk5, kk6, kk7, kk8, lesserFaydark, lf1, lf2, lg1, lg2, lg3, lg4, lg5, lg6, lowerGuk, nagafensLair, najena, nj1, nj2, nj3, nj4, nj5, nl1, nl2, nl3, nl4, nl5, nl6, nl7, nl8, nl9, nl10, nl11, nl12, northRo, nr1, nr2, permafrostKeep, pf1, pf2, pf3, pf4, pf5, pf6, pf7, pf8, pf9, pf10, pf11, pf12, pf13, pf14, pf15, pf16, pf17, pf18, pf19, pf20, pf21, pf22, ph1, ph2, ph3, ph4, ph5, ph6, ph7, ph8, ph9, ph10, ph11, ph12, ph13, pk1, pk2, pk3, pk4, pk5, pk6, pk7, pk8, pk9, planeOfFear, planeOfHate, repeatCB, repeatCm3, repeatCt3, repeatER, repeatKk3, repeatKk4, repeatLg3, repeatNl3, repeatNl4, repeatPk4, ug1, ug2, ug3, ug4, upperGuk";
	// message cID date time name
	// generate random string
	function rand_str($length, $charset='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'){
		$str = '';
		$count = strlen($charset);
		while($length--){
			$str .= $charset[mt_rand(0, $count-1)];
		}
		return $str;
	}

?>