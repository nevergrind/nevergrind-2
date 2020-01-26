var tooltip;
(function() {
	tooltip = {
		timer: new delayedCall(0, ''),
		isOpen: 0,
		openDate: 0,
		hide,
		show,
	};
	var el;
	var wearsLeather = [
		'BRD',
		'CLR',
		'DRU',
		'MNK',
		'PLD',
		'RNG',
		'ROG',
		'SHD',
		'SHM',
		'WAR',
	]
	var wearsMail = [
		'BRD',
		'CLR',
		'PLD',
		'RNG',
		'SHD',
		'SHM',
		'WAR',
	]
	var wearsPlate = [
		'BRD',
		'CLR',
		'PLD',
		'SHD',
		'WAR',
	]
	var weaponTypes = {
		oneHandSlashers: 'Sword',
		oneHandBlunts: 'Mace',
		piercers: 'Dagger',
		twoHandSlashers: 'Giant Sword',
		twoHandBlunts: 'Giant Mace',
		staves: 'Staff',
		bows: 'Bow',
		focus: 'Focus',
	}
	//////////////////////////////////////////////////
	function show(obj) {
		if (!_.size(obj)) return
		el = getById('tooltip-wrap')
		el.innerHTML = getItemHtml(obj)
		//e.style.top = posY() + 'px'
		//e.style.left = posX() + 'px'
		el.style.visibility = 'visible'
		tooltip.isOpen = 1
		tooltip.openDate = Date.now()
		TweenMax.to(el, .3, {
			opacity: 1,
		})
	}
	function getItemHtml(obj) {
		var html = ''
		html += '<div id="tooltip-name" class="item-' + _.kebabCase(obj.rarity) + '">' + obj.name + '</div>' +
			'<hr id="tooltip-hr">' +
			'<div class="flex space-between capitalize">' +
				'<div>'+ getItemSlot(obj.slots) +'</div>' +
				getRequiredItemSkill(obj) +
			'</div>' +
			getWeaponDamageHtml(obj) +
			(obj.armor ? '<div>'+ obj.armor +' Armor</div>' : '') +
			(obj.itemLevel > 1 ? getRequiredLevelHtml(obj.itemLevel) : '') +
			getDurabilityHtml(obj.durability) +
			// block
			getBlockChance(obj.blockRate + (obj.increasedBlock ? obj.increasedBlock : 0)) +
			getGenericPercentStatHtml(obj.increasedBlock, 'Increased Block Rate') +
			// armor and damage
			getGenericPercentStatHtml(obj.enhancedArmor, 'Enhanced Armor') +
			getGenericPercentStatHtml(obj.enhancedDamage, 'Enhanced Damage') +
			// ias
			getGenericPercentStatHtml(obj.haste, 'Increased Attack Speed') +
			// plus all
			getGenericStatHtml(obj.allSkills, 'All Skills') +
			getGenericStatHtml(obj.allStats, 'All Stats') +
			getGenericStatHtml(obj.resistAll, 'All Resistances') +
			getGenericStatHtml(obj.addSpellAll, 'All Spell Power') +
			getGenericPercentStatHtml(obj.enhanceAll, 'All Spell Damage') +
			// resists
			getGenericStatHtml(obj.resistBlood, 'Resist Blood') +
			getGenericStatHtml(obj.resistPoison, 'Resist Poison') +
			getGenericStatHtml(obj.resistArcane, 'Resist Arcane') +
			getGenericStatHtml(obj.resistLightning, 'Resist Lightning') +
			getGenericStatHtml(obj.resistFire, 'Resist Fire') +
			getGenericStatHtml(obj.resistIce, 'Resist Ice') +
			// spell power
			getGenericStatHtml(obj.addSpellBlood, 'Blood Spell Power') +
			getGenericStatHtml(obj.addSpellPoison, 'Poison Spell Power') +
			getGenericStatHtml(obj.addSpellArcane, 'Arcane Spell Power') +
			getGenericStatHtml(obj.addSpellLightning, 'Lightning Spell Power') +
			getGenericStatHtml(obj.addSpellFire, 'Fire Spell Power') +
			getGenericStatHtml(obj.addSpellIce, 'Ice Spell Power') +
			// attack
			getGenericStatHtml(obj.attack, 'Attack') +
			// skills
			getGenericStatHtml(obj.offense, 'Offense') +
			getGenericStatHtml(obj.defense, 'Defense') +
			getGenericStatHtml(obj.oneHandSlash, 'One-Hand Slash') +
			getGenericStatHtml(obj.oneHandBlunt, 'One-Hand Blunt') +
			getGenericStatHtml(obj.piercing, 'Piercing') +
			getGenericStatHtml(obj.archery, 'Archery') +
			getGenericStatHtml(obj.handToHand, 'Hand-to-Hand') +
			getGenericStatHtml(obj.twoHandSlash, 'Two-Hand Slash') +
			getGenericStatHtml(obj.twoHandBlunt, 'Two-Hand Blunt') +
			getGenericStatHtml(obj.dodge, 'Dodge') +
			getGenericStatHtml(obj.parry, 'Parry') +
			getGenericStatHtml(obj.riposte, 'Riposte') +
			getGenericStatHtml(obj.alteration, 'Alteration') +
			getGenericStatHtml(obj.conjuration, 'Conjuration') +
			getGenericStatHtml(obj.evocation, 'Evocation') +
			getGenericStatHtml(obj.crit, 'Critical Hit') +
			// attrs
			getGenericStatHtml(obj.str, 'Strength') +
			getGenericStatHtml(obj.sta, 'Stamina') +
			getGenericStatHtml(obj.agi, 'Agility') +
			getGenericStatHtml(obj.dex, 'Dexterity') +
			getGenericStatHtml(obj.wis, 'Wisdom') +
			getGenericStatHtml(obj.intel, 'Intelligence') +
			getGenericStatHtml(obj.cha, 'Charisma') +
			// points
			getGenericStatHtml(obj.hp, 'Health') +
			getGenericStatHtml(obj.mp, 'Mana') +
			getGenericStatHtml(obj.sp, 'Spirit') +
			// regen
			getGenericStatHtml(obj.hpRegen, 'Health Regen') +
			getGenericStatHtml(obj.mpRegen, 'Mana Regen') +
			getGenericStatHtml(obj.spRegen, 'Spirit Regen') +
			// leech
			getGenericStatHtml(obj.leech, 'Life Leech') +
			getGenericStatHtml(obj.wraith, 'Mana Leech') +
			// added damage
			getPropHtml(obj.addBlood, '+' + obj.addBlood + ' Blood Damage to Melee') +
			getPropHtml(obj.addPoison, '+' + obj.addPoison + ' Poison Damage to Melee') +
			getPropHtml(obj.addArcane, '+' + obj.addArcane + ' Arcane Damage to Melee') +
			getPropHtml(obj.addLightning, '+' + obj.addLightning + ' Lightning Damage to Melee') +
			getPropHtml(obj.addFire, '+' + obj.addFire + ' Fire Damage to Melee') +
			getPropHtml(obj.addIce, '+' + obj.addIce + ' Ice Damage to Melee') +
			// set/unique and beyond
			getGenericStatHtml(obj.damageTakenToMana, 'Mana When Damaged') +
			getGenericStatHtml(obj.damageTakenToSpirit, 'Spirit When Damaged') +
			// damage vs mob types
			getGenericPercentStatHtml(obj.enhancedDamageToHumanoids, 'Enhanced Damage vs Humanoids') +
			getGenericPercentStatHtml(obj.enhancedDamageToBeasts, 'Enhanced Damage vs Beasts') +
			getGenericPercentStatHtml(obj.enhancedDamageToUndead, 'Enhanced Damage vs Undead') +
			getGenericPercentStatHtml(obj.enhancedDamageToDemons, 'Enhanced Damage vs Demons') +
			getGenericPercentStatHtml(obj.enhancedDamageToDragonkin, 'Enhanced Damage vs Dragonkin') +
			getGenericPercentStatHtml(obj.enhancedDamageToEldritch, 'Enhanced Damage vs Eldritch') +
			// mitigation
			getGenericReducedStatHtml(obj.phyMit, 'Physical Damage Reduced by') +
			getGenericReducedStatHtml(obj.magMit, 'Magical Damage Reduced by') +
			// all spell damage
			getGenericPercentStatHtml(obj.enhanceBlood, 'All Blood Damage') +
			getGenericPercentStatHtml(obj.enhancePoison, 'All Poison Damage') +
			getGenericPercentStatHtml(obj.enhanceArcane, 'All Arcane Damage') +
			getGenericPercentStatHtml(obj.enhanceLightning, 'All Lightning Damage') +
			getGenericPercentStatHtml(obj.enhanceFire, 'All Fire Damage') +
			getGenericPercentStatHtml(obj.enhanceIce, 'All Ice Damage') +
			// status resists
			getPropHtml(obj.cannotBeFrozen, 'Cannot Be Frozen') +
			getPropHtml(obj.cannotBeFeared, 'Cannot Be Feared') +
			getPropHtml(obj.cannotBeStunned, 'Cannot Be Stunned') +
			getPropHtml(obj.cannotBeSilence, 'Cannot Be Silenced') +
			getPropHtml(obj.indestructible, 'Indestructible') +
			// debuff
			getPropHtml(obj.reducedHealing, obj.reducedHealing + '% Healing on Monsters') +
			getPropHtml(obj.restInPeace, 'Slain Monsters Rest in Peace') +
			getPropHtml(obj.slowsTarget, 'Slows Target ' + obj.slowsTarget + '%') +
			getPropHtml(obj.reduceTargetArmor, 'Reduces Target Armor ' + obj.reduceTargetArmor + '%') +
			getPropHtml(obj.ignoreTargetArmor, 'Ignores Target Armor') +
			getPropHtml(obj.increaseHpPercent, '+' + obj.increaseHpPercent + '% Total Health') +
			getPropHtml(obj.increaseMpPercent, '+' + obj.increaseMpPercent + '% Total Health') +
			getPropHtml(obj.hpKill, '+' + obj.hpKill + ' Health on Kill') +
			getPropHtml(obj.mpKill, '+' + obj.mpKill + ' Mana on Kill') +
			getPropHtml(obj.spKill, '+' + obj.spKill + ' Spirit on Kill') +
		'';

		return html
	}
	function getPropHtml(stat, label) {
		return stat ? '<div class="item-magic">' + label + '</div>' : ''
	}
	function getGenericReducedStatHtml(stat, label) {
		return stat ? '<div class="item-magic">' + label + ' ' + stat + '</div>' : ''
	}
	function getGenericStatHtml(stat, label) {
		return stat ? '<div class="item-magic">+' + stat + ' ' + label + '</div>' : ''
	}
	function getBlockChance(stat) {
		return stat ? '<div>Chance to Block: <span class="item-magic">' + stat + '%</span></div>' : ''
	}
	function getGenericPercentStatHtml(stat, label) {
		return stat ? '<div class="item-magic">+' + stat + '% ' + label + '</div>' : ''
	}
	function getWeaponDamageHtml(obj) {
		if (obj.weaponSkill) {
			var dps = (((obj.minDamage + obj.maxDamage) / 2) / obj.speed).toFixed(1);
			return '<div class="flex space-between">' +
				'<div>'+ obj.minDamage + '&thinsp;–&thinsp;' + obj.maxDamage +' Damage</div>' +
				'<div>Speed ' + obj.speed + '</div>' +
			'</div>' +
			'<div>(' + dps + ' damage per second)</div>'
		}
		else {
			return ''
		}
	}
	function getDurabilityHtml(durability) {
		return _.isUndefined(durability) ? '' : durability
			? '<div>Durability ' + durability + '/100</div>'
			: '<div class="item-restricted">Durability: ' + durability + '/100</div>'
	}
	function getRequiredLevelHtml(itemLevel) {
		var level = getRequiredLevel(itemLevel)
		if (level <= my.level) {
			return '<div>Requires Level '+ level +'</div>'
		}
		else {
			return '<div class="item-restricted">Requires Level '+ level +'</div>'
		}
	}
	function getRequiredLevel(itemLevel) {
		console.info('getRequiredLevel itemLevel: ', itemLevel)
		var level = ~~(itemLevel * .75);
		if (level < 1) level = 1;
		return level
	}
	function getItemSlot(slots) {
		var str = slots[0];
		if (slots[1] === 'secondary' && !my.dualWield) {
			str += ' <span class="item-restricted">' + slots[1] + '</span>'
		}
		else {
			str += slots[1] ? ' ' + slots[1] : ''
		}
		return str
	}
	function getRequiredItemSkill(obj) {
		if (obj.armorType) {
			if (canEquipArmor(obj.armorType)) {
				return '<div>'+ _.startCase(obj.armorType) +'</div>'
			}
			else {
				return '<div class="item-restricted">'+ _.startCase(obj.itemType) +'</div>'
			}
		}
		else if (obj.weaponSkill) {
			if (canEquipWeapon(obj.weaponSkill)) {
				return '<div>'+ weaponTypes[obj.itemType] +'</div>'
			}
			else {
				return '<div class="item-restricted">'+ weaponTypes[obj.itemType] +'</div>'
			}
		}
		else if (obj.itemType === 'shields') {
			return '<div>Shield</div>'
		}
		else if (obj.itemType === 'rings') {
			return '<div>Ring</div>'
		}
		else if (obj.itemType === 'amulets') {
			return '<div>Amulet</div>'
		}
		else if (obj.itemType === 'charms') {
			return '<div>Charm</div>'
		}
		else {
			return ''
		}
	}
	function canEquipArmor(armorType) {
		if (armorType === 'cloth') {
			return true
		}
		else if (armorType === 'leather') {
			return wearsLeather.includes(my.job)
		}
		else if (armorType === 'mail') {
			return wearsMail.includes(my.job)
		}
		else if (armorType === 'plate') {
			return wearsPlate.includes(my.job)
		}
	}
	function canEquipWeapon(weaponSkill) {
		if (weaponSkill === 'One-hand Slash') {
			if (my.oneHandSlash) {
				return true
			}
			else {
				return false
			}
		}
		else if (weaponSkill === 'One-hand Blunt') {
			if (my.oneHandBlunt) {
				return true
			}
			else {
				return false
			}
		}
		else if (weaponSkill === 'Piercing') {
			if (my.piercing) {
				return true
			}
			else {
				return false
			}
		}
		else if (weaponSkill === 'Two-hand Slash') {
			if (my.twoHandSlash) {
				return true
			}
			else {
				return false
			}
		}
		else if (weaponSkill === 'Two-hand Blunt') {
			if (my.twoHandBlunt) {
				return true
			}
			else {
				return false
			}
		}
		else if (weaponSkill === 'Archery') {
			if (my.archery) {
				return true
			}
			else {
				return false
			}
		}
	}
	function hide() {
		el = getById('tooltip-wrap');
		TweenMax.to(el, .2, {
			opacity: 0,
			onComplete: function() {
				el.style.visibility = 'hidden';
				tooltip.isOpen = 0;
			}
		});
	}
	function posX() {
		var el = $('#tooltip-wrap');
		var padding = parseInt(el.css('padding-left'), 10) * 2;
		var tooltipHalfWidth = padding * 2 + el.width() / 2;
		if (my.mouse.x < tooltipHalfWidth) {
			// too small
			my.mouse.x += tooltipHalfWidth / 2;
			if (my.mouse.x < 80) {
				my.mouse.x = 80;
			}
		}
		else if (my.mouse.x > window.innerWidth - tooltipHalfWidth) {
			// too big
			my.mouse.x -= tooltipHalfWidth / 2;
			var z = window.innerWidth - 80;
			if (my.mouse.x > z) {
				my.mouse.x = z;
			}

		}
		return my.mouse.x;
	}
	function posY() {
		// determine Y adjustment
		var verticalOffset = 15;
		var isMenuAbove = my.mouse.y < window.innerHeight / 2;
		var yAdjust = isMenuAbove ? verticalOffset : (~~$("#context-wrap").height() + verticalOffset) * -1;
		return my.mouse.y + yAdjust;
	}
})();