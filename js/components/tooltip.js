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
		handleEnter,
		handleLeave,
		conditionalHide,
		getDps,
	};
	const css = {
		usePadding: 'padding: .5rem .5rem 0 .5rem'
	}
	var tooltipEl = getElementById('tooltip-wrap')
	var useHtml = ''
	let hit
	const divider = '<hr class="fancy-hr" style="margin: .2rem 0">'
	//////////////////////////////////////////////////
	function getItemHtml(obj, type) {
		var html = ''
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
			'</div>'


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
		return stat ? `<div class="item-magic">+${stat} ${label}</div>` : ''
	}
	function getBlockChance(stat) {
		return stat ? `<div>Chance to Block: <span class="item-magic">${stat}%</span></div>` : ''
	}
	function getGenericPercentStatHtml(stat, label) {
		return stat ? `<div class="item-magic">+${stat}% ${label}</div>` : ''
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
			var dps = getDps(obj).toFixed(1)
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
		var str =  _.capitalize(slots[0])
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
		if (weaponSkill === LABEL.ONE_HAND_SLASH && my.oneHandSlash
			|| weaponSkill === 'One-hand Blunt' && my.oneHandBlunt
			|| weaponSkill === 'Piercing' && my.piercing
			|| weaponSkill === 'Two-hand Slash' && my.twoHandSlash
			|| weaponSkill === 'Two-hand Blunt' && my.twoHandBlunt
			|| weaponSkill === 'Archery' && my.archery) {
			return true
		}
		return false
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
			// x position
			tooltipEl.style.top = y + 'px'
			tooltipEl.style.left = slotElement.x + (68 * ng.responsiveRatio) + 'px'
			tooltipEl.style.bottom = 'auto'
			tooltipEl.style.right = 'auto'
			tooltipEl.style.transform = 'translate(0%, 0%)'
			/* code for left side
			tooltipEl.style.left = slotElement.x + 'px'
			tooltipEl.style.transform = 'translate(-100%, 0%)'
			 */
		}
		setTooltipVisible(.2)
	}
	function setTooltipVisible(duration) {
		tooltip.isOpen = 1
		tooltipEl.style.visibility = 'visible'
		tooltip.openDate = Date.now()
		TweenMax.to(tooltipEl, duration, {
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

	let skillHtml = ''
	function getSkillHtml(config) {
		let rank = my.skills[config.index]
		let minRank = rank > 0 ? rank : 1
		// console.info('getSkillHtml config', config)
		skillHtml = `
		<div style="margin: .1rem; border: .1rem ridge #048; padding: .1rem; border-radius: 4px">
			<div id="tooltip-name-bg" class="flex-column flex-center align-center">
				<div id="tooltip-name" class="text-center" style="font-size: 1.125rem">${config.name}</div>
			</div>
			<div id="tooltip-item-stat-wrap" class="text-center" style="border: .1rem ridge #013">
				<div style="padding: .2rem">`
				if (config.index !== void 0) {
					skillHtml += `<div class="${rank === 0 ? 'chat-danger' : 'chat-gold'}">Current Rank: ${rank}</div>`
				}
				if (typeof config.mp === 'function') {
					skillHtml += `<div style="color: #3bf">Mana Cost: ${config.mp(minRank)}</div>`
				}
				else if (typeof config.sp === 'function') {
					skillHtml += `<div style="color: #2c2">Spirit Cost: ${config.sp(minRank)}</div>`
				}
				if (typeof config.hate === 'number' && config.hate !== 0) {
					skillHtml += `<div class="chat-warning">Threat: ${ng.toPercent(config.hate)}%</div>`
				}
				if (config.enhancedDamage && config.enhancedDamage[minRank]) {
					skillHtml += `<div>Enhanced Damage: ${ng.toPercent(config.enhancedDamage[minRank])}%</div>`
				}
				if (config.hitBonus && config.hitBonus[minRank]) {
					skillHtml += `<div>Hit Modifier: ${config.hitBonus[minRank]}%</div>`
				}
				if (config.critBonus && config.critBonus[minRank]) {
					skillHtml += `<div>Crit Modifier: ${config.critBonus[minRank]}%</div>`
				}
				if (config.castTime) {
					skillHtml += `<div>Cast Time: ${ng.toMinSecs(config.castTime)}</div>`
				}
				if (config.cooldownTime) {
					skillHtml += `<div>Cooldown: ${ng.toMinSecs(config.cooldownTime)}</div>`
				}
				if (config.duration) {
					skillHtml += `<div>Duration: ${ng.toMinSecs(config.duration)}</div>`
				}
				if (config.spellType) {
					skillHtml += `<div>Spell Type: ${_.capitalize(config.spellType)}</div>`
				}
				if (config.damageType) {
					skillHtml += `<div class="damage-${config.damageType}">Element: ${_.capitalize(config.damageType)}</div>`
				}
				///////////////////////////////////////////////////////////////////////////
				if (config.requiresFrontRow) {
					skillHtml += `<div class="chat-skill">Requires Front Row Target</div>`
				}
				if (config.staggers) {
					skillHtml += `<div class="chat-skill">Staggers Target</div>`
				}
				if (config.cannotResist) {
					skillHtml += `<div class="chat-skill">Cannot Be Resisted</div>`
				}
				if (config.damageReduced) {
					skillHtml += `<div class="chat-skill">Physical Damage Reduced: ${ng.toPercent(config.damageReduced[minRank])}%</div>`
				}
				if (config.stunDuration) {
					skillHtml += `<div class="chat-skill">Stuns target for ${ng.toMinSecs(config.stunDuration)}</div>`
				}
				if (config.freezeDuration) {
					skillHtml += `
						<div class="chat-skill">Freezes target for ${ng.toMinSecs(config.freezeDuration)}</div>
					`
				}
				if (config.chillDuration) {
					skillHtml += `
						<div class="chat-skill">Chills target for ${ng.toMinSecs(config.chillDuration)}</div>
						<div class="chat-skill">Chilled targets attack 20% slower</div>
					`
				}
				if (config.paralyzeDuration) {
					skillHtml += `
						<div class="chat-skill">Paralyzes target for ${ng.toMinSecs(config.paralyzeDuration)}</div>
						<div class="chat-skill">Paralyzed targets fail 50% of their attacks</div>
					`
				}
				if (config.fearDuration) {
					skillHtml += `
						<div class="chat-skill">Fears target for ${ng.toMinSecs(config.fearDuration)}</div>
						<div class="chat-skill">Feared targets have a 50% damage penalty</div>
					`
				}
				if (config.isRanged) {
					skillHtml += `<div class="chat-skill">Ranged: Full damage to back row</div>`
				}
				if (config.isPiercing) {
					skillHtml += `<div class="chat-skill">Piercing: Cannot be parried or riposted</div>`
				}
				if (config.isBlighted) {
					skillHtml += `<div class="chat-skill">+50% damage to demons or undead</div>`
				}
				////////////////////////////////////////////////////////////////////
				if (config.hpMax) {
					skillHtml += `<div class="chat-skill">Health: ${config.hpMax[minRank]}</div>`
				}
				if (config.armor) {
					skillHtml += `<div class="chat-skill">Armor: ${config.armor[minRank]}</div>`
				}
				if (config.str) {
					skillHtml += `<div class="chat-skill">Strength: ${config.str[minRank]}</div>`
				}
				if (config.sta) {
					skillHtml += `<div class="chat-skill">Stamina: ${config.sta[minRank]}</div>`
				}
				if (config.agi) {
					skillHtml += `<div class="chat-skill">Agility: ${config.agi[minRank]}</div>`
				}
				if (config.dex) {
					skillHtml += `<div class="chat-skill">Dexterity: ${config.dex[minRank]}</div>`
				}
				if (config.wis) {
					skillHtml += `<div class="chat-skill">Wisdom: ${config.wis[minRank]}</div>`
				}
				if (config.intel) {
					skillHtml += `<div class="chat-skill">Intelligence: ${config.intel[minRank]}</div>`
				}
				if (config.cha) {
					skillHtml += `<div class="chat-skill">Charisma: ${config.cha[minRank]}</div>`
				}
				if (config.hpRegen) {
					skillHtml += `<div class="chat-skill">Health Regen: ${config.hpRegen[minRank]}</div>`
				}
				if (config.hpPercent) {
					skillHtml += `<div class="chat-skill">Health Percent Bonus: ${ng.toPercent(config.hpPercent[minRank])}%</div>`
				}
				if (config.mpRegen) {
					skillHtml += `<div class="chat-skill">Mana Regen: ${config.mpRegen[minRank]}</div>`
				}
				if (config.mpPercent) {
					skillHtml += `<div class="chat-skill">Mana Percent Bonus: ${ng.toPercent(config.mpPercent[minRank])}%</div>`
				}
				if (config.spRegen) {
					skillHtml += `<div class="chat-skill">Spirit Regen: ${config.spRegen[minRank]}</div>`
				}
				if (config.spPercent) {
					skillHtml += `<div class="chat-skill">Spirit Percent Bonus: ${ng.toPercent(config.spPercent[minRank])}%</div>`
				}
				if (config.resistPoison) {
					skillHtml += `<div class="chat-skill">Resist Poison: ${config.resistPoison[minRank]}</div>`
				}
				if (config.resistBlood) {
					skillHtml += `<div class="chat-skill">Resist Blood: ${config.resistBlood[minRank]}</div>`
				}
				if (config.resistArcane) {
					skillHtml += `<div class="chat-skill">Resist Arcane: ${config.resistArcane[minRank]}</div>`
				}
				if (config.resistLightning) {
					skillHtml += `<div class="chat-skill">Resist Lightning: ${config.resistLightning[minRank]}</div>`
				}
				if (config.resistFire) {
					skillHtml += `<div class="chat-skill">Resist Fire: ${config.resistFire[minRank]}</div>`
				}
				if (config.resistIce) {
					skillHtml += `<div class="chat-skill">Resist Ice: ${config.resistIce[minRank]}</div>`
				}
				if (config.resistAll) {
					if (config.name === 'Faded Strike') {
						skillHtml += `<div class="chat-skill">
							Resist All: ${round(config.resistAll[minRank] * config.ratioByStack[1])} to ${config.resistAll[minRank]}
						</div>`
					}
					else {
						skillHtml += `<div class="chat-skill">Resist All: ${config.resistAll[minRank]}</div>`
					}
				}
				if (config.resistPerStack) {
					skillHtml += `<div class="chat-skill">Resist All: ${config.resistPerStack}% to ${config.resistPerStack * 5}%</div>`
				}
				if (config.resistParalyze) {
					skillHtml += `<div class="chat-skill">Resist Paralyze: ${config.resistParalyze[minRank]}</div>`
				}
				if (config.resistFear) {
					skillHtml += `<div class="chat-skill">
						Resist Fear: ${typeof config.resistFear === 'number' ? config.resistFear : config.resistFear[minRank]}
					</div>`
				}
				if (config.resistStun) {
					skillHtml += `<div class="chat-skill">Resist Stun: ${config.resistStun[minRank]}</div>`
				}
				if (config.resistSilence) {
					skillHtml += `<div class="chat-skill">Resist Silence: ${config.resistSilence[minRank]}</div>`
				}
				if (config.reduceBloodResist) {
					skillHtml += `<div class="chat-skill">Reduce Blood Resistance: ${ng.toPercent(config.reduceBloodResist)}%</div>`
				}
				if (config.reducePoisonResist) {
					skillHtml += `<div class="chat-skill">Reduce Poison Resistance: ${ng.toPercent(config.reducePoisonResist)}%</div>`
				}
				if (config.reduceArcaneResist) {
					skillHtml += `<div class="chat-skill">Reduce Arcane Resistance: ${ng.toPercent(config.reduceArcaneResist)}%</div>`
				}
				if (config.reduceLightningResist) {
					skillHtml += `<div class="chat-skill">Reduce Lightning Resistance: ${ng.toPercent(config.reduceLightningResist[minRank])}%</div>`
				}
				if (config.reduceFireResist) {
					skillHtml += `<div class="chat-skill">Reduce Fire Resistance: ${ng.toPercent(config.reduceFireResist[minRank])}%</div>`
				}
				if (config.reduceIceResist) {
					skillHtml += `<div class="chat-skill">Reduce Ice Resistance: ${ng.toPercent(config.reduceIceResist[minRank])}%</div>`
				}
				if (config.reduceAllResists) {
					skillHtml += `<div class="chat-skill">Reduce All Resists: ${ng.toPercent(config.reduceAllResists[minRank])}%</div>`
				}
				if (config.mitigation) {
					skillHtml += `<div class="chat-skill">Damage Reduced: ${config.mitigation[minRank]}</div>`
				}
				if (config.evpMitigation) {
					skillHtml += `<div class="chat-skill">Damage Reduced: ${config.evpMitigation[minRank]}</div>`
				}
				if (config.slowPercent) {
					skillHtml += `<div class="chat-skill">Slows Target ${ng.toPercent(config.slowPercent)}%</div>`
				}
				if (config.debuffArmor) {
					skillHtml += `<div class="chat-skill">Debuff Armor: ${ng.toPercent(config.debuffArmor)}%</div>`
				}
				if (config.buffHitBonus) {
					skillHtml += `<div class="chat-skill">
						Hit Bonus: ${ng.toPercent(
					typeof config.buffHitBonus === 'number' ? config.buffHitBonus : config.buffHitBonus[minRank]
					)}%</div>`
				}
				if (config.buffCritBonus) {
					skillHtml += `<div class="chat-skill">Crit Bonus: ${ng.toPercent(config.buffCritBonus[minRank])}%</div>`
				}
				if (config.dodgeChance) {
					skillHtml += `<div class="chat-skill">
						Dodge: ${ng.toPercent(config.dodgeChance[minRank] * config.ratioByStack[1])} to ${ng.toPercent(config.dodgeChance[minRank])}%
					</div>`
				}
				if (config.debuffDodge) {
					skillHtml += `<div class="chat-skill">
						Debuff Dodge: ${config.debuffDodge[minRank]}%
					</div>`
				}
				if (config.addPoison) {
					skillHtml += `<div class="chat-skill">Added Poison Damage: ${config.addPoison[minRank]}</div>`
				}
				if (config.addLightning) {
					skillHtml += `<div class="chat-skill">Added Lightning Damage: ${config.addLightning[minRank]}</div>`
				}
				if (config.attackBonus) {
					skillHtml += `<div class="chat-skill">Attack Bonus: ${config.attackBonus[minRank]}</div>`
				}
				if (config.bonusDamage) {
					skillHtml += `<div class="chat-skill">
						Physical Damage Bonus: ${ng.toPercent(typeof config.bonusDamage === 'number' ? 
							config.bonusDamage : config.bonusDamage[minRank]
					)}%</div>`
				}
				if (config.reduceHitRate) {
					if (config.name === 'Suppressing Volley') {
						skillHtml += `<div class="chat-skill">Reduce Hit Rate: ${ng.toPercent(config.reduceHitRate[1])} to ${ng.toPercent(config.reduceHitRate[5])}%</div>`
					}
					else {
						console.info('config', config)
						skillHtml += `<div class="chat-skill">Reduce Hit Rate: ${ng.toPercent(config.reduceHitRate)}%</div>`
					}
				}
				if (config.reduceDamage) {
						skillHtml += `<div class="chat-skill">Reduce Damage: ${ng.toPercent(config.reduceDamage)}%</div>`
				}
				if (config.enhancePnB) {
					skillHtml += `
						<div class="chat-skill">Enhance Poison Damage by ${buffs.lichForm.enhancePnB[rank]}%</div>
						<div class="chat-skill">Enhance Blood Damage by ${buffs.lichForm.enhancePnB[rank]}%</div>
					`
				}
				if (config.attackHaste) {
					if (config.name === 'Rising Furor') {
						skillHtml += `<div class="chat-skill">
							Attack Haste: ${ng.toPercent(config.attackHaste[1])}% to ${ng.toPercent(config.attackHaste[5])}%
						</div>`
					}
					else {
						skillHtml += `<div class="chat-skill">
							Attack Haste: ${ng.toPercent(
						Array.isArray(config.attackHaste) ? config.attackHaste[minRank] : config.attackHaste
							)}%
						</div>`
					}
				}
				if (config.skillHaste) {
					if (config.name === 'Hyper Strike') {
						skillHtml += `<div class="chat-skill">
							Skill Haste: ${ng.toPercent(config.skillHaste[1])}% to ${ng.toPercent(config.skillHaste[5])}% 
						</div>`
					}
					else {
						skillHtml += `<div class="chat-skill">
							Skill Haste: ${ng.toPercent(
								Array.isArray(config.skillHaste) ? config.skillHaste[minRank] : config.skillHaste
							)}%
						</div>`
					}
				}
				if (config.castingHaste) {
					skillHtml += `<div class="chat-skill">
						Casting Haste: ${ng.toPercent(
							Array.isArray(config.castingHaste) ? config.castingHaste[minRank] : config.castingHaste
						)}%
					</div>`
				}
				//////////////////////////////////////////////////
				if (config.index !== void 0) {
					skillHtml += divider
				}
				// hit damage
				hit = {}
				if (isRangedOrMelee(config)) {
					// console.info('is ranged or skill', config)
					// TODO: Something off here with physical damage calc
					if (config.isRangedDamage) {
						hit = skills.enhanceHit(
							stats.rangedDamage(-1, -100, true),
							config.enhancedDamage[minRank]
						)
					}
					else {
						hit = skills.enhanceHit(
							stats.skillDamage(-1, -100, true),
							config.enhancedDamage[minRank]
						)
					}
					/*
					if (hit.min &&
						typeof config.enhancedDamage[minRank] === 'number') {
						hit.min *= config.enhancedDamage[minRank]
						hit.max *= config.enhancedDamage[minRank]
					}*/
				}
				else if (isSpell(config)) {
					hit = stats.spellDamage(-1, -100, config)
					// console.info('spell damage', hit)
				}
				else {
					// console.info('no damage found', config)
				}
				if (hit.min) {
					if (!config.isBuff) {
						config.damageString = getDamageRange(hit)
						/*skillHtml += `<div>
							${config.isHeal ? `Heal` : config.isShield ? `Shield Health` : `Damage`}: ${config.damageString}
						</div>`*/
					}
				}
				config.rank = rank
				skillHtml += `
					<div style="color: gold">
						${typeof config.description === 'string' ? config.description : config.description(config)}
					</div>
				</div>
			</div>
		</div>
		`
		return skillHtml
		///////////////////////////////
		function isRangedOrMelee(config) {
			return Array.isArray(config.hitBonus) && config.hitBonus.some(v => v !== 0)
		}
		function isSpell(config) {
			return typeof config.spellDamage === 'function' &&
				config.castTime > 0 &&
				!config.isBuff
		}
	}
	function getDamageRange(hit) {
		let min = _.max([1, round(hit.min)])
		let max = _.max([1, round(hit.max)])
		return min === max ? min : min +'-'+ max
	}
	function showSkill(config) {
		tooltipEl.innerHTML = getSkillHtml(config)
		tooltipEl.style.bottom = '.5rem'
		tooltipEl.style.right = '.5rem'
		// x position
		tooltipEl.style.top = 'auto'
		tooltipEl.style.left = 'auto'
		tooltipEl.style.transform = 'translate(0%, 0%)'
		setTooltipVisible(.5)
	}
	function handleEnter(event) {
		if (event.currentTarget.id === ('skill-primary-attack-btn')) {
			let hit = stats.primaryAutoAttackDamage(0, true)
			showSkill({
				name: 'Primary Attack',
				description: config => '<div>Attack with your primary weapon dealing '+ getDamageRange(hit) +' physical damage.</div>'
			})
		}
		else if (event.currentTarget.id === ('skill-secondary-attack-btn')) {
			let hit = stats.secondaryAutoAttackDamage(0, true)
			showSkill({
				name: 'Secondary Attack',
				description: config => '<div>Attack with your secondary weapon dealing '+ getDamageRange(hit) +' physical damage. The dual wield skill makes this skill succeed more often.</div>'
			})
		}
		else if (event.currentTarget.id.startsWith('skill') || event.currentTarget.id.startsWith('academy')) {
			var index = _.last(event.currentTarget.id.split('-'))
			var skillData = skills[my.job][index]
			var buffData = buffs[_.camelCase(skills[my.job][index].name)]
			showSkill({
				index: index,
				...skillData,
				...buffData,
			})
		}
		else {
			// item slots
			var {index, type} = _.pick(event.currentTarget.dataset, KEYS.ITEM_ENTER)
			tooltip.lastHoveredType = type
			tooltip[type].isHovering = true
			if (items[type][index].name) {
				tooltip.show(items[type][index], querySelector('#' + type + '-slot-img-' + index), type)
			}
		}
	}
	function handleLeave(event) {
		if (event.currentTarget.id.startsWith('skill') || event.currentTarget.id.startsWith('academy')) {
			tooltip.hide()
		}
		else {
			var {index, type} = _.pick(event.currentTarget.dataset, KEYS.ITEM_ENTER)
			tooltip[type].isHovering = false
			tooltip.hide()
		}
	}
	function conditionalHide() {
		if (typeof tooltip[tooltip.lastHoveredType] === 'object' &&
			tooltip[tooltip.lastHoveredType].isHovering) {
			tooltip.hide()
			tooltip[tooltip.lastHoveredType].isHovering = false
		}
	}
})($, parseInt, TweenMax, _, getComputedStyle);