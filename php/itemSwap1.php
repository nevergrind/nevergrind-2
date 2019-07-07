<?php
	require 'connect1.php';
	function itemSwap(){
		global $link;
		$i1 = $_POST['item1'];
		$i2 = $_POST['item2'];
		$itemDropType = $_POST['itemDropType'];
		$dropSlot = $_POST['dropSlot'];
		$itemDragType = $_POST['itemDragType'];
		$dragSlot = $_POST['dragSlot'];
		// drop the dragged item
		if($itemDragType=='bank'){
			$stmt = $link->prepare($_SESSION['queryBank']);
			$stmt->bind_param('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiisiiiiiiiisiiiiiiiiisiiiiiiiisiiiiiiiiiiiiiiiiisiiiiiissis', 
				$i1['abjuration'], $i1['absorbCold'], $i1['absorbFire'], $i1['absorbLightning'], $i1['absorbMagic'], 
				$i1['absorbPoison'], $i1['agi'], $i1['allResist'], $i1['allSkills'], $i1['allStats'], 
				$i1['alteration'], $i1['armor'], $i1['attack'], $i1['castingHaste'], $i1['cha'], 
				$i1['channeling'], $i1['cold'], $i1['coldDamage'], $i1['conjuration'], $i1['critChance'], 
				$i1['critDamage'], $i1['damage'], $i1['defense'], $i1['delay'], $i1['dex'], 
				$i1['dodge'], $i1['doubleAttack'], $i1['dualWield'], $i1['enhanceAll'], $i1['enhanceCold'], 
				$i1['enhanceFire'], $i1['enhanceLightning'], $i1['enhanceMagic'], $i1['enhancePhysical'], $i1['enhancePoison'], 
				$i1['enhancedArmor'], $i1['enhancedDamage'], $i1['evocation'], $i1['expFind'], $i1['fear'], 
				$i1['fireDamage'], $i1['flavorText'], $i1['globalHaste'], $i1['goldFind'], $i1['handtohand'], 
				$i1['haste'], $i1['hp'], $i1['hpKill'], $i1['hpRegen'], $i1['ias'], 
				$i1['itemSlot'], $i1['intel'], $i1['leech'], $i1['lightRadius'], $i1['lightningDamage'], 
				$i1['magMit'], $i1['magicDamage'], $i1['mp'], $i1['mpKill'], $i1['mpRegen'], 
				$i1['name'], $i1['offense'], $i1['oneHandBlunt'], $i1['oneHandSlash'], $i1['parry'], 
				$i1['phyMit'], $i1['physicalDamage'], $i1['piercing'], $i1['poisonDamage'], $i1['proc'], 
				$i1['quality'], $i1['rarity'], $i1['req'], $i1['resistCold'], $i1['resistFire'], 
				$i1['resistLightning'], $i1['resistMagic'], $i1['resistPoison'], $i1['riposte'], $i1['runSpeed'], 
				$i1['silence'], $i1['sta'], $i1['str'], $i1['stun'], $i1['thorns'], 
				$i1['twoHandBlunt'], $i1['twoHandSlash'], $i1['type'], $i1['upgrade'], $i1['weight'], 
				$i1['wis'], $i1['wraith'], $i1['xPos'], $i1['yPos'], $_SESSION['email'], 
				$itemDragType, $dragSlot, $_SESSION['hardcoreMode']);
		}else{
			$stmt = $link->prepare($_SESSION['queryItem']);
			$stmt->bind_param('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiisiiiiiiiisiiiiiiiiisiiiiiiiisiiiiiiiiiiiiiiiiisiiiiiisssi', 
				$i1['abjuration'], $i1['absorbCold'], $i1['absorbFire'], $i1['absorbLightning'], $i1['absorbMagic'], 
				$i1['absorbPoison'], $i1['agi'], $i1['allResist'], $i1['allSkills'], $i1['allStats'], 
				$i1['alteration'], $i1['armor'], $i1['attack'], $i1['castingHaste'], $i1['cha'], 
				$i1['channeling'], $i1['cold'], $i1['coldDamage'], $i1['conjuration'], $i1['critChance'], 
				$i1['critDamage'], $i1['damage'], $i1['defense'], $i1['delay'], $i1['dex'], 
				$i1['dodge'], $i1['doubleAttack'], $i1['dualWield'], $i1['enhanceAll'], $i1['enhanceCold'], 
				$i1['enhanceFire'], $i1['enhanceLightning'], $i1['enhanceMagic'], $i1['enhancePhysical'], $i1['enhancePoison'], 
				$i1['enhancedArmor'], $i1['enhancedDamage'], $i1['evocation'], $i1['expFind'], $i1['fear'], 
				$i1['fireDamage'], $i1['flavorText'], $i1['globalHaste'], $i1['goldFind'], $i1['handtohand'], 
				$i1['haste'], $i1['hp'], $i1['hpKill'], $i1['hpRegen'], $i1['ias'], 
				$i1['itemSlot'], $i1['intel'], $i1['leech'], $i1['lightRadius'], $i1['lightningDamage'], 
				$i1['magMit'], $i1['magicDamage'], $i1['mp'], $i1['mpKill'], $i1['mpRegen'], 
				$i1['name'], $i1['offense'], $i1['oneHandBlunt'], $i1['oneHandSlash'], $i1['parry'], 
				$i1['phyMit'], $i1['physicalDamage'], $i1['piercing'], $i1['poisonDamage'], $i1['proc'], 
				$i1['quality'], $i1['rarity'], $i1['req'], $i1['resistCold'], $i1['resistFire'], 
				$i1['resistLightning'], $i1['resistMagic'], $i1['resistPoison'], $i1['riposte'], $i1['runSpeed'], 
				$i1['silence'], $i1['sta'], $i1['str'], $i1['stun'], $i1['thorns'], 
				$i1['twoHandBlunt'], $i1['twoHandSlash'], $i1['type'], $i1['upgrade'], $i1['weight'], 
				$i1['wis'], $i1['wraith'], $i1['xPos'], $i1['yPos'], $_SESSION['email'], 
				$_POST['name'], $itemDragType, $dragSlot);
		}
		$stmt->execute();
		// drop the dropped item
		if($itemDropType=='bank'){
			$stmt = $link->prepare($_SESSION['queryBank']);
			$stmt->bind_param('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiisiiiiiiiisiiiiiiiiisiiiiiiiisiiiiiiiiiiiiiiiiisiiiiiissis', 
				$i2['abjuration'], $i2['absorbCold'], $i2['absorbFire'], $i2['absorbLightning'], $i2['absorbMagic'], 
				$i2['absorbPoison'], $i2['agi'], $i2['allResist'], $i2['allSkills'], $i2['allStats'], 
				$i2['alteration'], $i2['armor'], $i2['attack'], $i2['castingHaste'], $i2['cha'], 
				$i2['channeling'], $i2['cold'], $i2['coldDamage'], $i2['conjuration'], $i2['critChance'], 
				$i2['critDamage'], $i2['damage'], $i2['defense'], $i2['delay'], $i2['dex'], 
				$i2['dodge'], $i2['doubleAttack'], $i2['dualWield'], $i2['enhanceAll'], $i2['enhanceCold'], 
				$i2['enhanceFire'], $i2['enhanceLightning'], $i2['enhanceMagic'], $i2['enhancePhysical'], $i2['enhancePoison'], 
				$i2['enhancedArmor'], $i2['enhancedDamage'], $i2['evocation'], $i2['expFind'], $i2['fear'], 
				$i2['fireDamage'], $i2['flavorText'], $i2['globalHaste'], $i2['goldFind'], $i2['handtohand'], 
				$i2['haste'], $i2['hp'], $i2['hpKill'], $i2['hpRegen'], $i2['ias'], 
				$i2['itemSlot'], $i2['intel'], $i2['leech'], $i2['lightRadius'], $i2['lightningDamage'], 
				$i2['magMit'], $i2['magicDamage'], $i2['mp'], $i2['mpKill'], $i2['mpRegen'], 
				$i2['name'], $i2['offense'], $i2['oneHandBlunt'], $i2['oneHandSlash'], $i2['parry'], 
				$i2['phyMit'], $i2['physicalDamage'], $i2['piercing'], $i2['poisonDamage'], $i2['proc'], 
				$i2['quality'], $i2['rarity'], $i2['req'], $i2['resistCold'], $i2['resistFire'], 
				$i2['resistLightning'], $i2['resistMagic'], $i2['resistPoison'], $i2['riposte'], $i2['runSpeed'], 
				$i2['silence'], $i2['sta'], $i2['str'], $i2['stun'], $i2['thorns'], 
				$i2['twoHandBlunt'], $i2['twoHandSlash'], $i2['type'], $i2['upgrade'], $i2['weight'], 
				$i2['wis'], $i2['wraith'], $i2['xPos'], $i2['yPos'], $_SESSION['email'], 
				$itemDropType, $dropSlot, $_SESSION['hardcoreMode']);
		}else{
			$stmt = $link->prepare($_SESSION['queryItem']);
			$stmt->bind_param('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiisiiiiiiiisiiiiiiiiisiiiiiiiisiiiiiiiiiiiiiiiiisiiiiiisssi', 
				$i2['abjuration'], $i2['absorbCold'], $i2['absorbFire'], $i2['absorbLightning'], $i2['absorbMagic'], 
				$i2['absorbPoison'], $i2['agi'], $i2['allResist'], $i2['allSkills'], $i2['allStats'], 
				$i2['alteration'], $i2['armor'], $i2['attack'], $i2['castingHaste'], $i2['cha'], 
				$i2['channeling'], $i2['cold'], $i2['coldDamage'], $i2['conjuration'], $i2['critChance'], 
				$i2['critDamage'], $i2['damage'], $i2['defense'], $i2['delay'], $i2['dex'], 
				$i2['dodge'], $i2['doubleAttack'], $i2['dualWield'], $i2['enhanceAll'], $i2['enhanceCold'], 
				$i2['enhanceFire'], $i2['enhanceLightning'], $i2['enhanceMagic'], $i2['enhancePhysical'], $i2['enhancePoison'], 
				$i2['enhancedArmor'], $i2['enhancedDamage'], $i2['evocation'], $i2['expFind'], $i2['fear'], 
				$i2['fireDamage'], $i2['flavorText'], $i2['globalHaste'], $i2['goldFind'], $i2['handtohand'], 
				$i2['haste'], $i2['hp'], $i2['hpKill'], $i2['hpRegen'], $i2['ias'], 
				$i2['itemSlot'], $i2['intel'], $i2['leech'], $i2['lightRadius'], $i2['lightningDamage'], 
				$i2['magMit'], $i2['magicDamage'], $i2['mp'], $i2['mpKill'], $i2['mpRegen'], 
				$i2['name'], $i2['offense'], $i2['oneHandBlunt'], $i2['oneHandSlash'], $i2['parry'], 
				$i2['phyMit'], $i2['physicalDamage'], $i2['piercing'], $i2['poisonDamage'], $i2['proc'], 
				$i2['quality'], $i2['rarity'], $i2['req'], $i2['resistCold'], $i2['resistFire'], 
				$i2['resistLightning'], $i2['resistMagic'], $i2['resistPoison'], $i2['riposte'], $i2['runSpeed'], 
				$i2['silence'], $i2['sta'], $i2['str'], $i2['stun'], $i2['thorns'], 
				$i2['twoHandBlunt'], $i2['twoHandSlash'], $i2['type'], $i2['upgrade'], $i2['weight'], 
				$i2['wis'], $i2['wraith'], $i2['xPos'], $i2['yPos'], $_SESSION['email'], 
				$_POST['name'], $itemDropType, $dropSlot);
		}
		$stmt->execute();
	}
	call_user_func($_POST['run']);
?>