var tooltip;
(function($, parseInt, TweenMax, _, getComputedStyle, undefined) {
	tooltip = {
		lastHoveredType: '',
		eq: { isHovering: false },
		inv: { isHovering: false },
		bank: { isHovering: false },
		merchant: { isHovering: false },
		blacksmith: { isHovering: false },
		apothecary: { isHovering: false },
		tavern: { isHovering: false },
		tradeTo: { isHovering: false },
		tradeFrom: { isHovering: false },
		timer: new delayedCall(0, ''),
		isOpen: 0,
		openDate: 0,
		goldValue: 1,
		hide,
		show,
		handleItemEnter,
		handleItemLeave,
		conditionalHide,
		getDps,
	};
	const css = {
		usePadding: 'padding: .5rem .5rem 0 .5rem'
	}
	var tooltipEl = getElementById('tooltip-wrap')
	var useHtml = ''
	//////////////////////////////////////////////////
	function getItemHtml(obj, type) {
		var html = ''
		var divider = '<hr class="fancy-hr" style="margin: .2rem 0">'
		var statHtml = ''
		html +=
			'<div style="margin: .1rem; border: .1rem ridge #048; padding: .1rem; border-radius: 4px">' +
			'<div class="flex" style="border: .1rem ridge #013; margin-bottom: .1rem">' +
				'<div id="tooltip-item-img-bg">' +
					'<img id="tooltip-item-img" src="images/items/'+ bar.getItemIconFileNameByObj(obj) + '.png">' +
				'</div>' +
				'<div style="border: 1px ridge #013"></div>' +
				'<div id="tooltip-name-bg" class="flex-column flex-center align-center">' +
					'<div id="tooltip-name" class="text-center item-' + _.kebabCase(obj.rarity) + '">' + (obj.unidentified ? obj.baseName : obj.name) + '</div>' +
					(obj.unidentified ? '' :
					(
						obj.rarity === 'unique'
						? '<div class="item-' + _.kebabCase(obj.rarity) + '" style="font-size: .8rem">' + obj.baseName + '</div>'
						: ''
					)) +
				'</div>' +
			'</div>' +
			'<div id="tooltip-item-stat-wrap" class="text-center" style="border: .1rem ridge #013">' +
			'<div style="padding: .2rem">' +
				getItemUse(obj) +
				getWeaponDamageHtml(obj) +
				(obj.armor ? '<div>'+ obj.armor +' Armor</div>' : '') +
				getRequiredItemProficiency(obj) +
				getItemSlot(obj.slots) +
				(obj.itemLevel > 1 ? getRequiredLevelHtml(obj.itemLevel) : '') +
			'</div>';


			statHtml += '<div style="padding: .2rem">' +
				// block
				getBlockChance(obj.blockRate + (obj.increasedBlock ? obj.increasedBlock : 0)) +
				getGenericPercentStatHtml(obj.increasedBlock, 'Increased Block Rate') +
				// armor and damage
				getGenericPercentStatHtml(obj.enhancedArmor, 'Enhanced Armor') +
				getGenericPercentStatHtml(obj.enhancedDamage, 'Enhanced Damage') +
				// ias
				getGenericPercentStatHtml(obj[PROP.HASTE], 'Increased Attack Speed') +
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
				getGenericStatHtml(obj.resistPhysical, 'Resist Physical') +
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
				getGenericStatHtml(obj.oneHandSlash, LABEL.ONE_HAND_SLASH) +
				getGenericStatHtml(obj.oneHandBlunt, 'One-hand Blunt') +
				getGenericStatHtml(obj.piercing, 'Piercing') +
				getGenericStatHtml(obj.archery, 'Archery') +
				getGenericStatHtml(obj.handToHand, 'Hand-to-hand') +
				getGenericStatHtml(obj.twoHandSlash, 'Two-hand Slash') +
				getGenericStatHtml(obj.twoHandBlunt, 'Two-hand Blunt') +
				getGenericStatHtml(obj.dodge, 'Dodge') +
				getGenericStatHtml(obj.parry, 'Parry') +
				getGenericStatHtml(obj.riposte, 'Riposte') +
				getGenericStatHtml(obj.alteration, 'Alteration') +
				getGenericStatHtml(obj.conjuration, 'Conjuration') +
				getGenericStatHtml(obj.evocation, 'Evocation') +
				getGenericStatHtml(obj.crit, 'Critical Hit') +
				// attrs
				getGenericStatHtml(obj.str, LABEL.STR) +
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
				getGenericPercentStatHtml(obj.enhancedDamageToMystical, 'Enhanced Damage vs Mystical') +
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
				getGenericPercentStatHtml(obj.resistParalyze, 'Paralyze Resist') +
				getGenericPercentStatHtml(obj.resistFear, 'Fear Resist') +
				getGenericPercentStatHtml(obj.resistStun, 'Stun Resist') +
				getGenericPercentStatHtml(obj.resistSilence, 'Silence Resist') +
				// debuff
				//getPropHtml(obj.reduceHealing, obj.reduceHealing + '% Healing on Monsters') +
				//getPropHtml(obj.restInPeace, 'Slain Monsters Rest in Peace') +
				//getPropHtml(obj.slowsTarget, 'Slows Target ' + obj.slowsTarget + '%') +
				getPropHtml(obj.reduceTargetArmor, 'Reduces Target Armor ' + obj.reduceTargetArmor + '%') +
				getPropHtml(obj.ignoreTargetArmor, 'Ignores Target Armor') +
				getPropHtml(obj.increaseHpPercent, '+' + obj.increaseHpPercent + '% Maximum Health') +
				getPropHtml(obj.increaseMpPercent, '+' + obj.increaseMpPercent + '% Maximum Mana') +
				getPropHtml(obj.hpKill, '+' + obj.hpKill + ' Health on Kill') +
				getPropHtml(obj.mpKill, '+' + obj.mpKill + ' Mana on Kill') +
				getPropHtml(obj.spKill, '+' + obj.spKill + ' Spirit on Kill') +
				(obj.ease ? getEaseHtml(obj.ease) : '') +
			'</div>';
			if (statHtml.includes('item-magic')) {
				// found at least one stat added to html str
				html += divider;
			}
			if (obj.unidentified) {
				html += '<div class="item-restricted" style="padding: .2rem">Unidentified</div>'
			}
			else {
				html += statHtml
			}
			if (town.isMerchantMode()) {
				html += item.getItemValueHtml(obj, type === 'inv' || type === 'eq')
			}
			html += '</div>' +
			'</div>' +
		'';

		return html
	}
	function getEaseHtml(ease) {
		if (ease === 1) return '<div class="item-magic">Requirements -20%</div>'
		else if (ease === 2) return '<div class="item-magic">Requirements -30%</div>'
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
	function getItemUse(obj) {
		useHtml = ''
		if (obj.use) {
			if (obj.itemType === 'potion') {
				useHtml = '<div class="item-use" style="'+ css.usePadding +'">Use: '+
					item.getPotionUseMessage(obj) +
				'</div>'
			}
			else if (obj.itemType === 'scroll') {
				useHtml = '<div class="item-use" style="'+ css.usePadding +'">Use: '+
					'Reveal hidden properties of unidentified items in your inventory.' +
				'</div>'
			}
		}
		return useHtml
	}
	function getWeaponDamageHtml(obj) {
		if (obj.weaponSkill) {
			var dps = getDps(obj).toFixed(1);
			return '<div>Damage: '+ obj.minDamage + '&thinsp;–&thinsp;' + obj.maxDamage +'</div>' +
				'<div>Speed: ' + (obj.speed % 1 === 0 ? obj.speed + '.0' : obj.speed) +'</div>' +
				'<div>Damage Per Second: ' + dps + '</div>'
		}
		else {
			return ''
		}
	}
	function getDps(obj) {
		return (((obj.minDamage + obj.maxDamage) / 2) / obj.speed)
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
		var level = ~~(itemLevel * 1);
		if (level < 1) level = 1;
		return level
	}
	function getItemSlot(slots) {
		if (!slots) return ''
		var prefix = 'Slot: '
		var str =  _.capitalize(slots[0]);
		if (slots[1] === 'secondary') {
			prefix = 'Slots: '
			if (stats.getPropMax(PROP.DUAL_WIELD)) {
				str += ' ' + _.capitalize(slots[1])
			}
			else {
				str += ' <span class="item-restricted">' + _.capitalize(slots[1]) + '</span>'
			}
		}
		return '<div>' + prefix + str + '</div>'
	}
	function getRequiredItemProficiency(obj) {
		if (obj.armorType) {
			if (item.canEquipArmor(obj.armorType)) {
				return '<span>Proficiency:&nbsp;'+ _.startCase(obj.armorType) +'</span>'
			}
			else {
				return 'Proficiency:&nbsp;<span class="item-restricted">'+ _.startCase(obj.armorType) +'</span>'
			}
		}
		else if (obj.weaponSkill) {
			if (canEquipWeapon(obj.weaponSkill)) {
				return '<span>Proficiency:&nbsp;'+ obj.weaponSkill +'</span>'
			}
			else {
				return 'Proficiency:&nbsp;<span class="item-restricted">'+ obj.weaponSkill +'</span>'
			}
		}
		else {
			return ''
		}
	}
	function canEquipWeapon(weaponSkill) {
		if (weaponSkill === LABEL.ONE_HAND_SLASH) {
			if (my.oneHandSlash) return true
			else return false
		}
		else if (weaponSkill === 'One-hand Blunt') {
			if (my.oneHandBlunt) return true
			else return false
		}
		else if (weaponSkill === 'Piercing') {
			if (my.piercing) return true
			else return false
		}
		else if (weaponSkill === 'Two-hand Slash') {
			if (my.twoHandSlash) return true
			else return false
		}
		else if (weaponSkill === 'Two-hand Blunt') {
			if (my.twoHandBlunt) return true
			else return false
		}
		else if (weaponSkill === 'Archery') {
			if (my.archery) return true
			else return false
		}
	}

	function show(obj, slotElement, type) {
		if (!_.size(obj)) return
		tooltipEl.innerHTML = getItemHtml(obj, type)
		if (slotElement) {
			// x position
			var y = slotElement.y - (4 * ng.responsiveRatio)
			var height = parseInt(getComputedStyle(tooltipEl).height, 10)
			var diff = window.innerHeight - (y + height)
			if (diff < 50) {
				// keep from going off the bottom of the screen
				y -= (50 - diff)
			}
			tooltipEl.style.top = y + 'px'
			// x position
			tooltipEl.style.left = slotElement.x + (68 * ng.responsiveRatio) + 'px'
			tooltipEl.style.transform = 'translate(0%, 0%)'
			/* code for left side
			tooltipEl.style.left = slotElement.x + 'px'
			tooltipEl.style.transform = 'translate(-100%, 0%)'
			 */
		}
		tooltip.isOpen = 1
		tooltipEl.style.visibility = 'visible'
		tooltip.openDate = Date.now()
		TweenMax.to(tooltipEl, .2, {
			overwrite: 1,
			opacity: 1,
		})
	}
	function hide() {
		TweenMax.to(tooltipEl, .1, {
			opacity: 0,
			overwrite: 1,
			onComplete: hideComplete
		});
	}
	function hideComplete() {
		tooltipEl.style.visibility = 'hidden'
		tooltip.isOpen = 0
		tooltipEl.innerHTML = ''
	}
	function handleItemEnter(event) {
		var {index, type} = _.pick(event.currentTarget.dataset, KEYS.ITEM_ENTER)
		tooltip.lastHoveredType = type
		tooltip[type].isHovering = true
		if (items[type][index].name) {
			tooltip.show(items[type][index], querySelector('#' + type + '-slot-img-' + index), type)
		}
	}
	function handleItemLeave(event) {
		var {index, type} = _.pick(event.currentTarget.dataset, KEYS.ITEM_ENTER)
		tooltip[type].isHovering = false
		tooltip.hide()
	}
	function conditionalHide() {
		if (typeof tooltip[tooltip.lastHoveredType] === 'object' &&
			tooltip[tooltip.lastHoveredType].isHovering) {
			tooltip.hide()
			tooltip[tooltip.lastHoveredType].isHovering = false
		}
	}
})($, parseInt, TweenMax, _, getComputedStyle);