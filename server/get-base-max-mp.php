<?php
function getBaseMaxMp($hero){
	$lvl = $hero['level'];
	require 'enum/no-mana-jobs.php';
	if (in_array($hero['job'], $noManaJobs, true)){
		return 0;
	}
	require 'enum/hybrids.php';
	if (in_array($hero['job'], $hybrids, true)){
		if ($lvl < 9){
			return 0;
		} else {
			$lvl -= 8;
		}
	}
	$tierMulti = [
		'Cleric' => 3.8,
		'Druid' => 3.8,
		'Enchanter' => 4.5,
		'Templar' => 4.5,
		'Warlock' => 4.5,
		'Crusader' => 2,
		'Ranger' => 2, 
		'Shadow Knight' => 2,
		'Shaman' => 3.8, 
		'Wizard' => 4.5
	];
	$levelTier = [
		'Cleric' => 12,
		'Druid' => 12,
		'Enchanter' => 14,
		'Templar' => 14,
		'Warlock' => 14,
		'Crusader' => 7,
		'Ranger' => 7, 
		'Shadow Knight' => 7,
		'Shaman' => 12, 
		'Wizard' => 14
	];
	$v = 20;
	$tierBonus = $tierMulti[$hero['job']];
	$levelBonus = $levelTier[$hero['job']];
	$v += round(($hero['intel'] * $tierBonus) * ($lvl / 50) + ($lvl * $levelBonus));
	return $v;
}