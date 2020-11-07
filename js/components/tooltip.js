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
	function buffDuration(seconds) {
		if (seconds === 1) return seconds + ' second'
		else return seconds + ' seconds'

	}
	let skillHtml = ''
	function getSkillHtml(config) {
		let rank = my.skills[config.index]
		console.info('getSkillHtml config', config)
		skillHtml = `
		<div style="margin: .1rem; border: .1rem ridge #048; padding: .1rem; border-radius: 4px">
			<div id="tooltip-name-bg" class="flex-column flex-center align-center">
				<div id="tooltip-name" class="text-center" style="font-size: 1.125rem">${config.name}</div>
			</div>
			<div id="tooltip-item-stat-wrap" class="text-center" style="border: .1rem ridge #013">
				<div style="padding: .2rem">`
				if (rank >= 1) {
					if (typeof config.mp === 'function') {
						skillHtml += `<div style="color: #3bf">Mana Cost: ${config.mp(rank)}</div>`
					}
					else if (typeof config.sp === 'function') {
						skillHtml += `<div style="color: #2c2">Spirit Cost: ${config.sp(rank)}</div>`
					}
					if (config.castTime) {
						skillHtml += `<div>Cast Time: ${ng.toMinSecs(config.castTime)}</div>`
					}
					if (config.cooldownTime) {
						skillHtml += `<div>Cooldown: ${ng.toMinSecs(config.cooldownTime)}</div>`
					}
					if (config.enhancedDamage && config.enhancedDamage[rank]) {
						skillHtml += `<div>Enhanced Damage: ${ng.toPercent(config.enhancedDamage[rank])}%</div>`
					}
					if (config.hitBonus && config.hitBonus[rank]) {
						skillHtml += `<div>Hit Bonus: ${config.hitBonus[rank]}%</div>`
					}
					if (config.critBonus && config.critBonus[rank]) {
						skillHtml += `<div>Crit Bonus: ${config.critBonus[rank]}%</div>`
					}
					if (config.duration) {
						skillHtml += `<div>Duration: ${ng.toMinSecs(config.duration)}</div>`
					}
					if (config.spellType) {
						skillHtml += `<div>Spell Type: ${_.capitalize(config.spellType)}</div>`
					}
					if (config.damageType) {
						skillHtml += `<div class="damage-${config.damageType}">Damage Type: ${_.capitalize(config.damageType)}</div>`
					}
					if (config.hate) {
						skillHtml += `<div>Threat: ${ng.toPercent(config.hate)}%</div>`
					}
					if (config.requiresFrontRow) {
						skillHtml += `<div class="chat-warning">Requires Front Row Target</div>`
					}
					if (config.staggers) {
						skillHtml += `<div class="chat-warning">Staggers Target</div>`
					}
					if (config.stunDuration) {
						skillHtml += `<div class="chat-warning">Stuns target for ${buffDuration(config.stunDuration)}</div>`
					}
					if (config.chillDuration) {
						skillHtml += `<div class="chat-warning">Chills target for ${buffDuration(config.chillDuration)}</div>`
					}
					if (config.freezeDuration) {
						skillHtml += `<div class="chat-warning">Freezes target for ${buffDuration(config.freezeDuration)}</div>`
					}
					if (config.paralyzeDuration) {
						skillHtml += `<div class="chat-warning">Paralyzes target for ${buffDuration(config.paralyzeDuration)}</div>`
					}
					if (config.fearDuration) {
						skillHtml += `<div class="chat-warning">Fears target for ${buffDuration(config.fearDuration)}</div>`
					}
					if (config.slowPercent) {
						skillHtml += `<div class="chat-warning">Slows target ${ng.toPercent(config.slowPercent)}%</div>`
					}
					if (config.isRanged) {
						skillHtml += `<div class="chat-warning">Ranged: Full damage to back row</div>`
					}
					if (config.isPiercing) {
						skillHtml += `<div class="chat-warning">Piercing: Cannot be parried or riposted</div>`
					}
					if (config.isBlighted) {
						skillHtml += `<div class="chat-warning">Blighted: 50% enhanced damage to undead and demons</div>`
					}
					skillHtml += divider
					// hit damage
					hit = {}
					if (config.enhancedDamage) {
						// TODO: Something off here with physical damage calc
						if (config.isRangedDamage) {
							hit = stats.rangedDamage(-1, -100, true)
						}
						else {
							hit = stats.skillDamage(-1, -100, true)
						}
						if (hit.min) {
							hit.min *= config.enhancedDamage[rank]
							hit.max *= config.enhancedDamage[rank]
						}
					}
					else if (config.spellDamage) {
						hit = stats.spellDamage(-1, -100, config)
					}
					console.info('hit', hit)
					if (hit.min) {
						config.damageString = _.max([1, round(hit.min)]) +'-'+ _.max([1, round(hit.max)])
						skillHtml += `<div>Damage: ${config.damageString}</div>`
					}
				}
				console.info('hit:', config.damageString, hit)
				skillHtml += `<div style="color: gold">${config.description}</div>
				</div>
			</div>
		</div>
		`
		return skillHtml
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
			hit = stats.primaryAutoAttackDamage(0, true)
			showSkill({
				name: 'Primary Attack',
				description: 'Attack with your primary weapon for '+ round(hit.min) +' to '+ round(hit.max)+' damage.'
			})
		}
		else if (event.currentTarget.id === ('skill-secondary-attack-btn')) {
			hit = stats.secondaryAutoAttackDamage(0, true)
			showSkill({
				name: 'Secondary Attack',
				description: 'Attack with your secondary weapon for '+ round(hit.min) +' to '+ round(hit.max)+' damage. Dual wield must pass a skill check in order to work.'
			})
		}
		else if (event.currentTarget.id.startsWith('skill')) {
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
		if (event.currentTarget.id.startsWith('skill')) {
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