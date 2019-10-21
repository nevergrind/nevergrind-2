var item;
var items = {};
!function() {
	item = {
		getEquipString,
		getItem,
	}
	var slotRequiresMagic = [
		'rings',
		'amulets',
		'charms',
	]
	var MAX_TREASURE_CLASS = 45
	var prefixNames = {
		resistBlood: function(val, multi) {
			if (val <= 10 * multi) { return 'Ruddy' }
			else if (val <= 20 * multi) { return 'Crimson' }
			else if (val <= 30 * multi) { return 'Burgundy' }
			else { return 'Scarlet' }
		},
		resistPoison: function(val, multi) {
			if (val <= 10 * multi) { return 'Beryl' }
			else if (val <= 20 * multi) { return 'Viridian' }
			else if (val <= 30 * multi) { return 'Jade' }
			else { return 'Emerald' }
		},
		resistArcane: function(val, multi) {
			if (val <= 10 * multi) { return 'Quartz' }
			else if (val <= 20 * multi) { return 'Opal' }
			else if (val <= 30 * multi) { return 'Beryl' }
			else { return 'Sphene' }
		},
		resistLightning: function(val, multi) {
			if (val <= 10 * multi) { return 'Tangerine' }
			else if (val <= 20 * multi) { return 'Ocher' }
			else if (val <= 30 * multi) { return 'Coral' }
			else { return 'Amber' }
		},
		resistFire: function(val, multi) {
			if (val <= 10 * multi) { return 'Crimson' }
			else if (val <= 20 * multi) { return 'Russet' }
			else if (val <= 30 * multi) { return 'Garnet' }
			else { return 'Ruby' }
		},
		resistIce: function(val, multi) {
			if (val <= 10 * multi) { return 'Azure' }
			else if (val <= 20 * multi) { return 'Lapis' }
			else if (val <= 30 * multi) { return 'Cobalt' }
			else { return 'Sapphire' }
		},
		resistAll: function(val, multi) {
			if (val <= 7 * multi) { return 'Shimmering' }
			else if (val <= 11 * multi) { return 'Rainbow' }
			else if (val <= 15 * multi) { return 'Scintillating' }
			else if (val <= 20 * multi) { return 'Prismatic' }
			else { return 'Chromatic' }
		},
		addSpellBlood: function(val, multi) {
			if (val <= 7 * multi) { return 'Ailing' }
			else if (val <= 11 * multi) { return 'Blighting' }
			else if (val <= 15 * multi) { return 'Afflicting' }
			else if (val <= 20 * multi) { return 'Tribulating' }
			else { return 'Grieving' }
		},
		addSpellPoison: function(val, multi) {
			if (val <= 7 * multi) { return 'Unsettling' }
			else if (val <= 11 * multi) { return 'Agonizing' }
			else if (val <= 15 * multi) { return 'Agitating' }
			else if (val <= 20 * multi) { return 'Writhing' }
			else { return 'Tormenting' }
		},
		addSpellArcane: function(val, multi) {
			if (val <= 7 * multi) { return 'Astounding' }
			else if (val <= 11 * multi) { return 'Confounding' }
			else if (val <= 15 * multi) { return 'Mystifying' }
			else if (val <= 20 * multi) { return 'Stupefying' }
			else { return 'Bewildering' }
		},
		addSpellLightning: function(val, multi) {
			if (val <= 7 * multi) { return 'Conductive' }
			else if (val <= 11 * multi) { return 'Rippling' }
			else if (val <= 15 * multi) { return 'Crackling' }
			else if (val <= 20 * multi) { return 'Amplified' }
			else { return 'Psionic' }
		},
		addSpellFire: function(val, multi) {
			if (val <= 7 * multi) { return 'Simmering' }
			else if (val <= 11 * multi) { return 'Sizzling' }
			else if (val <= 15 * multi) { return 'Scorching' }
			else if (val <= 20 * multi) { return 'Boiling' }
			else { return 'Scalding' }
		},
		addSpellIce: function(val, multi) {
			if (val <= 7 * multi) { return 'Icing' }
			else if (val <= 11 * multi) { return 'Numbing' }
			else if (val <= 15 * multi) { return 'Frosting' }
			else if (val <= 20 * multi) { return 'Chilling' }
			else { return 'Freezing' }
		},
		addSpellAll: function(val, multi) {
			if (val <= 7 * multi) { return 'Stellar' }
			else if (val <= 11 * multi) { return 'Celestial' }
			else if (val <= 15 * multi) { return 'Astral' }
			else if (val <= 20 * multi) { return 'Cosmic' }
			else { return 'Chromatic' }
		},
		enhancedArmor: function(val) {
			if (val <= 30) { return 'Sturdy' }
			else if (val <= 40) { return 'Strong' }
			else if (val <= 50) { return 'Glorious' }
			else if (val <= 65) { return 'Blessed' }
			else if (val <= 80) { return 'Saintly' }
			else { return 'Holy' }
		},
		enhancedDamage: function(val) {
			if (val <= 20) { return 'Jagged' }
			else if (val <= 30) { return 'Deadly' }
			else if (val <= 40) { return 'Vicious' }
			else if (val <= 50) { return 'Brutal' }
			else if (val <= 65) { return 'Massive' }
			else if (val <= 80) { return 'Savage' }
			else { return 'Merciless' }
		},
		attack: function(val, multi) {
			if (val <= 20 * multi) { return 'Bronze' }
			else if (val <= 40 * multi) { return 'Iron' }
			else if (val <= 60 * multi) { return 'Steel' }
			else if (val <= 80 * multi) { return 'Silver' }
			else { return 'Gold' }
		},
		offense: function(val, multi) {
			if (val <= 1 * multi) { return 'Cavalier\'s' }
			else if (val <= 2 * multi) { return 'Knight\'s' }
			else { return 'Templar\'s' }
		},
		defense: function(val, multi) {
			if (val <= 1 * multi) { return 'Escort\'s' }
			else if (val <= 2 * multi) { return 'Defender\'s' }
			else { return 'Guardian\'s' }
		},
		oneHandSlash: function(val, multi) {
			if (val <= 1 * multi) { return 'Fencer\'s' }
			else if (val <= 2 * multi) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		oneHandBlunt: function(val, multi) {
			if (val <= 1 * multi) { return 'Minister\'s' }
			else if (val <= 2 * multi) { return 'Vicar\'s' }
			else { return 'Reverend\'s' }
		},
		piercing: function(val, multi) {
			if (val <= 1 * multi) { return 'Marauder\'s' }
			else if (val <= 2 * multi) { return 'Raider\'s' }
			else { return 'Brigand\'s' }
		},
		archery: function(val, multi) {
			if (val <= 1 * multi) { return 'Fletcher\'s' }
			else if (val <= 2 * multi) { return 'Bowyer\'s' }
			else { return 'Archer\'s' }
		},
		handToHand: function(val, multi) {
			if (val <= 1 * multi) { return 'Fighter\'s' }
			else if (val <= 2 * multi) { return 'Pugilist\'s' }
			else { return 'Brawler\'s' }
		},
		twoHandSlash: function(val, multi) {
			if (val <= 1 * multi) { return 'Vanquisher\'s' }
			else if (val <= 2 * multi) { return 'Vindicator\'s' }
			else { return 'Conqueror\'s' }
		},
		twoHandBlunt: function(val, multi) {
			if (val <= 1 * multi) { return 'Reprover\'s' }
			else if (val <= 2 * multi) { return 'Rebuker\'s' }
			else { return 'Castigator\'s' }
		},
		dodge: function(val, multi) {
			if (val <= 1 * multi) { return 'Gymnast\'s' }
			else if (val <= 2 * multi) { return 'Acrobat\'s' }
			else { return 'Athlete\'s' }
		},
		parry: function(val, multi) {
			if (val <= 1 * multi) { return 'Cadet\'s' }
			else if (val <= 2 * multi) { return 'Veteran\'s' }
			else { return 'Officer\'s' }
		},
		riposte: function(val, multi) {
			if (val <= 1 * multi) { return 'Hireling\'s' }
			else if (val <= 2 * multi) { return 'Mercenary\'s' }
			else { return 'Legionnaire\'s' }
		},
		alteration: function(val, multi) {
			if (val <= 1 * multi) { return 'Priest\'s' }
			else if (val <= 2 * multi) { return 'Friar\'s' }
			else { return 'Elder\'s' }
		},
		conjuration: function(val, multi) {
			if (val <= 1 * multi) { return 'Conjurer\'s' }
			else if (val <= 2 * multi) { return 'Seer\'s' }
			else { return 'Warlock\'s' }
		},
		evocation: function(val, multi) {
			if (val <= 1 * multi) { return 'Evoker\'s' }
			else if (val <= 2 * multi) { return 'Sorcerer\'s' }
			else { return 'Magus\'s' }
		},
		allSkills: function(val, multi) {
			if (val <= 1 * multi) { return 'Angel\'s' }
			else { return 'Arch-Angel\'s' }
		},
	}
	var suffixNames = {
		str: function(val, multi) {
			if (val <= 2 * multi) { return 'of Strength' }
			else if (val <= 5 * multi) { return 'of Might' }
			else if (val <= 9 * multi) { return 'of the Ox' }
			else if (val <= 15 * multi) { return 'of the Giants' }
			else if (val <= 20 * multi) { return 'of the Titans' }
			else { return 'of Atlas' }
		},
		sta: function(val, multi) {
			if (val <= 2 * multi) { return 'of Stamina' }
			else if (val <= 5 * multi) { return 'of Vitality' }
			else if (val <= 9 * multi) { return 'of Zest' }
			else if (val <= 15 * multi) { return 'of Vim' }
			else if (val <= 20 * multi) { return 'of Vigor' }
			else { return 'of Life' }
		},
		agi: function(val, multi) {
			if (val <= 2 * multi) { return 'of Agility' }
			else if (val <= 5 * multi) { return 'of Quickness' }
			else if (val <= 9 * multi) { return 'of Swiftness' }
			else if (val <= 15 * multi) { return 'of Alacrity' }
			else if (val <= 20 * multi) { return 'of Celerity' }
			else { return 'of Speed' }
		},
		dex: function(val, multi) {
			if (val <= 2 * multi) { return 'of Dexterity' }
			else if (val <= 5 * multi) { return 'of Skill' }
			else if (val <= 9 * multi) { return 'of Accuracy' }
			else if (val <= 15 * multi) { return 'of Precision' }
			else if (val <= 20 * multi) { return 'of Perfection' }
			else { return 'of Nirvana' }
		},
		wis: function(val, multi) {
			if (val <= 2 * multi) { return 'of Wisdom' }
			else if (val <= 5 * multi) { return 'of Discernment' }
			else if (val <= 9 * multi) { return 'of Foresight' }
			else if (val <= 15 * multi) { return 'of Intuition' }
			else if (val <= 20 * multi) { return 'of Judgment' }
			else { return 'of Acumen' }
		},
		intel: function(val, multi) {
			if (val <= 2 * multi) { return 'of Intelligence' }
			else if (val <= 5 * multi) { return 'of the Mind' }
			else if (val <= 9 * multi) { return 'of Brilliance' }
			else if (val <= 15 * multi) { return 'of Sorcery' }
			else if (val <= 20 * multi) { return 'of Wizardry' }
			else { return 'of Enlightenment' }
		},
		cha: function(val, multi) {
			if (val <= 2 * multi) { return 'of Charisma' }
			else if (val <= 5 * multi) { return 'of Allure' }
			else if (val <= 9 * multi) { return 'of Glamour' }
			else if (val <= 15 * multi) { return 'of Magnetism' }
			else if (val <= 20 * multi) { return 'of Temptation' }
			else { return 'of Persuasion' }
		},
		allStats: function(val, multi) {
			if (val <= 3 * multi) { return 'of the Sky' }
			else if (val <= 7 * multi) { return 'of the Moon' }
			else if (val <= 11 * multi) { return 'of the Stars' }
			else if (val <= 15 * multi) { return 'of the Heavens' }
			else { return 'of the Firmament' }
		},
		hp: function(val, multi) {
			if (val <= 5 * multi) { return 'of the Jackal' }
			else if (val <= 10 * multi) { return 'of the Fox' }
			else if (val <= 20 * multi) { return 'of the Wolf' }
			else if (val <= 30 * multi) { return 'of the Tiger' }
			else if (val <= 40 * multi) { return 'of the Mammoth' }
			else { return 'of the Colossus' }
		},
		mp: function(val, multi) {
			if (val <= 5 * multi) { return 'of the Lizard' }
			else if (val <= 10 * multi) { return 'of the Snake' }
			else if (val <= 20 * multi) { return 'of the Serpent' }
			else if (val <= 30 * multi) { return 'of the Drake' }
			else if (val <= 40 * multi) { return 'of the Wyrm' }
			else { return 'of the Dragon' }
		},
		sp: function(val, multi) {
			if (val <= 5 * multi) { return 'of the Sedated' }
			else if (val <= 10 * multi) { return 'of the Placid' }
			else if (val <= 20 * multi) { return 'of the Serene' }
			else if (val <= 30 * multi) { return 'of the Staid' }
			else if (val <= 40 * multi) { return 'of the Tranquil' }
			else { return 'of the Halcyon' }
		},
		hpRegen: function(val, multi) {
			if (val <= 4 * multi) { return 'of Regeneration' }
			else if (val <= 6 * multi) { return 'of Regrowth' }
			else { return 'of Revivification' }
		},
		mpRegen: function(val, multi) {
			if (val <= 4 * multi) { return 'of Rumination' }
			else if (val <= 6 * multi) { return 'of Meditation' }
			else { return 'of Cogitation' }
		},
		spRegen: function(val, multi) {
			if (val <= 4 * multi) { return 'of Echoes' }
			else if (val <= 6 * multi) { return 'of Reverberation' }
			else { return 'of Resound' }
		},
		crit: function(val, multi) {
			if (val <= 4 * multi) { return 'of the Guerrilla' }
			else if (val <= 8 * multi) { return 'of the Cutthroat' }
			else if (val <= 12 * multi) { return 'of the Assassin' }
			else if (val <= 16 * multi) { return 'of the Rake' }
			else { return 'of the Blackguard' }
		},
		leech: function(val, multi) {
			if (val <= 4 * multi) { return 'of the Leech' }
			else if (val <= 6 * multi) { return 'of the Locust' }
			else { return 'of the Lamprey' }
		},
		wraith: function(val, multi) {
			if (val <= 4 * multi) { return 'of the Bat' }
			else if (val <= 6 * multi) { return 'of the Wraith' }
			else { return 'of the Vampire' }
		},
		haste: function(val) {
			if (val <= 10) { return 'of Readiness' }
			else if (val <= 20) { return 'of Swiftness' }
			else if (val <= 30) { return 'of Speed' }
			else { return 'of Haste' }
		},
		increasedBlock: function(val) {
			if (val <= 4) { return 'of the Bastion' }
			else if (val <= 8) { return 'of the Redoubt' }
			else if (val <= 12) { return 'of the Fortress' }
			else if (val <= 16) { return 'of the Rampart' }
			else { return 'of the Bulwark' }
		},
	}
	var minValue = {
		resistBlood: 2,
		resistPoison: 2,
		resistArcane: 2,
		resistLightning: 2,
		resistFire: 2,
		resistIce: 2,
		resistAll: 1,
		enhancedArmor: 5,
		enhancedDamage: 5,
		addSpellBlood: 2,
		addSpellPoison: 2,
		addSpellArcane: 2,
		addSpellLightning: 2,
		addSpellFire: 2,
		addSpellIce: 2,
		addSpellAll: 2,
		attack: 2,
		offense: 1,
		defense: 1,
		oneHandSlash: 1,
		oneHandBlunt: 1,
		piercing: 1,
		archery: 1,
		handToHand: 1,
		twoHandSlash: 1,
		twoHandBlunt: 1,
		dodge: 1,
		parry: 1,
		riposte: 1,
		alteration: 1,
		conjuration: 1,
		evocation: 1,
		allSkills: 1,
		str: 1,
		sta: 1,
		agi: 1,
		dex: 1,
		wis: 1,
		intel: 1,
		cha: 1,
		allStats: 1,
		hp: 1,
		hpRegen: 2,
		mp: 1,
		mpRegen: 2,
		sp: 1,
		spRegen: 2,
		crit: 1,
		leech: 1,
		wraith: 1,
		haste: 5,
		addBlood: 2,
		addPoison: 2,
		addArcane: 2,
		addLightning: 2,
		addFire: 2,
		addIce: 2,
		increaseBlock: 2,
	}
	var twoHandItemTypes = [
		'twoHandSlashers',
		'twoHandBlunts',
		'staves',
		'bows',
	]
	////////////////////////////////////////////
	function getEquipString() {
		// cloth, leather, mail, plate, weapon types should show red if you can't use it
	}
	function getItem(config) {
		var rarityTypes = [
			'normal',
			'magic',
			'rare',
			'set',
			'unique',
			'runic',
			'legendary',
		]
		// set item type (normal, magic, etc)
		var rarityIndex = config.rarityIndex
		var rarity = rarityTypes[rarityIndex]

		var keys = _.keys(items)
		var filteredKeys = _.filter(keys, filterKeys)
		var len = filteredKeys.length;
		var itemSlot = filteredKeys[_.random(0, len - 1)]

		var itemObj = _.cloneDeep(items[itemSlot])
		//console.info('itemObj', rarity, itemObj)

		// get item-filtered base item
		var filteredItems = _.filter(itemObj['normal'], filterItems)
		var filteredItemsLen = filteredItems.length
		// pick one of the items from the array
		var filteredItemsIndex = _.random(0, filteredItemsLen - 1)
		var drop = _.assign(
			itemObj.base,
			filteredItems[filteredItemsIndex]
		)
		//console.info('drop', _.cloneDeep(drop))
		// check defense range
		if (drop.minArmor) {
			drop.armor = _.random(drop.minArmor, drop.maxArmor)
			delete drop.minArmor
			delete drop.maxArmor
		}
		drop.rarity = rarity
		drop.durability = 100
		drop.itemType = itemSlot
		// magic
		if (rarity === 'magic' || rarity === 'rare') {
			// pre-process item props for magic and rare
			itemObj.prefix = convertProps(itemObj.prefix)
			itemObj.suffix = convertProps(itemObj.suffix)
			itemObj.rare = convertProps(itemObj.rare)
			removeWeaponSpecificProps(drop.itemType)
			var prefixKeys = _.keys(itemObj.prefix)
			var suffixKeys = _.keys(itemObj.suffix)
			var rareKeys = _.uniq(_.concat(
				prefixKeys,
				suffixKeys,
				_.keys(itemObj.rare)
			))

			console.info('prefixKeys', prefixKeys)
			console.info('suffixKeys', suffixKeys)
			console.info('rareKeys', rareKeys)
			if (rarity === 'magic') {
				processMagicDrop(drop)
			}
			if (rarity === 'rare') {
				processRareDrop(drop)
			}
		}
		return drop;
		////////////////////////////////////////////////////
		function processRareDrop(drop) {
			console.info('rare drop', drop, config)
		}
		function processMagicDrop(drop) {
			console.info('magic drop', drop, config)
			// get prefix and suffix
			var prefix = prefixKeys[_.random(0, prefixKeys.length - 1)]
			var suffix = suffixKeys[_.random(0, suffixKeys.length - 1)]
			// get values and names
			var prefixVal = 0
			var suffixVal = 0
			var prefixName = ''
			var suffixName = ''
			var itemTypeMultiplier = getMultiplierByTypeAndProp(drop.itemType)
			//TODO: unlock props by treasure class? Need data object for it
			//TODO: Add rare props - refactor for easy code reuse
			//console.warn('config', config.mobLevel)
			console.info('itemObj', itemObj)
			var tc = getTreasureClass(config.mobLevel)
			// set prefix and bound check
			var prefixMax = setMaxPropValue(itemObj.prefix, prefix, tc)
			// set suffix and bound check
			var suffixMax = setMaxPropValue(itemObj.suffix, suffix, tc)
			console.info('infos', config.mobLevel, tc, prefix, prefixMax, suffix, suffixMax)
			console.warn('max ', prefixMax, suffixMax)

			var getPrefixSuffixComboType = _.random(0, 100)
			if (getPrefixSuffixComboType < 50) {
				prefixVal = _.random(minValue[prefix], prefixMax);
				prefixName = prefixNames[prefix](prefixVal, itemTypeMultiplier)
			}
			else if (getPrefixSuffixComboType < 75) {
				suffixVal = _.random(minValue[suffix], suffixMax)
				suffixName = suffixNames[suffix](suffixVal, itemTypeMultiplier)
			}
			else {
				// both
				prefixVal = _.random(minValue[prefix], prefixMax);
				prefixName = prefixNames[prefix](prefixVal, itemTypeMultiplier)
				suffixVal = _.random(minValue[suffix], suffixMax)
				suffixName = suffixNames[suffix](suffixVal, itemTypeMultiplier)
			}

			if (ng.test) {
				// for better testing on all combos
				prefixVal = _.random(minValue[prefix], prefixMax);
				prefixName = prefixNames[prefix](prefixVal, itemTypeMultiplier)
				suffixVal = _.random(minValue[suffix], suffixMax)
				suffixName = suffixNames[suffix](suffixVal, itemTypeMultiplier)
			}

			// assign property values
			if (prefixVal) {
				drop[prefix] = prefixVal
			}
			if (suffixVal) {
				drop[suffix] = suffixVal
			}
			// set collateral values as a result of prop updates
			if (drop.haste) {
				var newSpeed = (drop.speed - (drop.speed * (drop.haste / 100))).toFixed(1)
				console.warn('new speed:', drop.speed, newSpeed)
				drop.speed = newSpeed * 1
			}
			if (drop.enhancedArmor) {
				var newArmor = (drop.armor + (drop.armor * (drop.enhancedArmor / 100))).toFixed(1)
				drop.armor = Math.round(newArmor * 1)
			}
			if (drop.enhancedDamage) {
				var newMinDamage = (drop.minDamage + (drop.minDamage * (drop.enhancedDamage / 100))).toFixed(1) * 1
				var newMaxDamage = (drop.maxDamage + (drop.maxDamage * (drop.enhancedDamage / 100))).toFixed(1) * 1
				drop.minDamage = Math.round(newMinDamage)
				drop.maxDamage = Math.round(newMaxDamage)
			}
			drop.name = [
				prefixName,
				drop.name,
				suffixName
			].join(' ').trim()
			return drop
		}
		///////////////////////////////////////////////
		function getMultiplierByTypeAndProp(itemType) {
			return (itemType === 'twoHandSlashers' ||
				itemType === 'twoHandBlunts' ||
				itemType === 'staves' ||
				itemType === 'bows') ? 2 : 1
		}

		function removeWeaponSpecificProps(itemType) {
			//console.warn('removeWeaponSpecificProps', itemType, itemObj.prefix)
			var props = []
			if (itemType === 'oneHandSlashers') {
				props = [
					'oneHandBlunt',
					'piercing',
					'archery',
					'handToHand',
					'twoHandSlash',
					'twoHandBlunt',
				]
			}
			else if (itemType === 'oneHandBlunts' || itemType === 'focus') {
				props = [
					'oneHandSlash',
					'piercing',
					'archery',
					'handToHand',
					'twoHandSlash',
					'twoHandBlunt',
				]
			}
			else if (itemType === 'piercers') {
				props = [
					'oneHandSlash',
					'oneHandBlunt',
					'archery',
					'handToHand',
					'twoHandSlash',
					'twoHandBlunt',
				]
			}
			else if (itemType === 'twoHandSlashers') {
				props = [
					'oneHandSlash',
					'oneHandBlunt',
					'piercing',
					'archery',
					'handToHand',
					'twoHandBlunt',
				]
			}
			else if (itemType === 'twoHandBlunts' || itemType === 'staves') {
				props = [
					'oneHandSlash',
					'oneHandBlunt',
					'piercing',
					'archery',
					'handToHand',
					'twoHandSlash',
				]
			}
			else if (itemType === 'bows') {
				props = [
					'oneHandSlash',
					'oneHandBlunt',
					'piercing',
					'handToHand',
					'twoHandSlash',
					'twoHandBlunt',
				]
			}
			props.forEach(function(prop) {
				delete itemObj.prefix[prop]
			})
		}

		function filterKeys(key) {
			if (rarityIndex === 0) {
				return !slotRequiresMagic.includes(key)
			}
			else {
				return true;
			}
		}
		function filterItems(item) {
			return item.itemLevel <= config.mobLevel
		}
	}

	function setMaxPropValue(obj, key, tc) {
		console.info('setMaxPropValue', obj[key], key, tc)
		var val = (obj[key] * (tc / MAX_TREASURE_CLASS)) - minValue[key]
		if (val < minValue[key]) { val = minValue[key] }
		return Math.round(val)
	}

	function getTreasureClass(tc) {
		if (tc > 45) {
			tc = 45
		}
		else if (tc < 3) {
			tc = 3
		}
		return Math.round(tc)
	}

	function convertProps(props) {
		var prop, val, newProps = [];
		for (prop in props) {
			newProps = []
			val = props[prop]
			//console.info('processProp', prop, val)
			if (prop === 'resists') {
				newProps = [
					'resistBlood',
					'resistPoison',
					'resistArcane',
					'resistLightning',
					'resistFire',
					'resistIce',
				]
			}
			else if (prop === 'skills') {
				newProps = [
					'offense',
					'defense',
					'oneHandSlash',
					'oneHandBlunt',
					'piercing',
					'archery',
					'handToHand',
					'twoHandSlash',
					'twoHandBlunt',
					'dodge',
					'parry',
					'riposte',
					'alteration',
					'conjuration',
					'evocation',
				]
			}
			else if (prop === 'spellPower') {
				newProps = [
					'addSpellBlood',
					'addSpellPoison',
					'addSpellArcane',
					'addSpellLightning',
					'addSpellFire',
					'addSpellIce',
				]
			}
			else if (prop === 'castingSkills') {
				newProps = [
					'alteration',
					'conjuration',
					'evocation',
				]
			}
			else if (prop === 'stats') {
				newProps = [
					'str',
					'sta',
					'agi',
					'dex',
					'wis',
					'intel',
					'cha',
				]
			}
			else if (prop === 'points') {
				newProps = [
					'hp',
					'mp',
					'sp',
				]
			}
			else if (prop === 'regen') {
				newProps = [
					'hpRegen',
					'mpRegen',
					'spRegen',
				]
			}
			else if (prop === 'addDamage') {
				newProps = [
					'addBlood',
					'addPoison',
					'addArcane',
					'addLightning',
					'addFire',
					'addIce',
				]
			}
			if (newProps.length) {
				newProps.forEach(function(prop) {
					props[prop] = val
				})
				delete props[prop]
			}
		}
		return props
	}
	function processProp(val, prop) {
	}

	function getRareName(newItem, newType, newName) {
		var foo = newName;
		var x = "Beast";
		var y = "Torc";
		var qux = ~~(1 + Math.random() * 42);
		if (qux === 1) {
			x = "Armageddon";
		}
		if (qux === 2) {
			x = "Beast";
		}
		if (qux === 3) {
			x = "Bitter";
		}
		if (qux === 4) {
			x = "Blood";
		}
		if (qux === 5) {
			x = "Bone";
		}
		if (qux === 6) {
			x = "Bramble";
		}
		if (qux === 7) {
			x = "Brimstone";
		}
		if (qux === 8) {
			x = "Carrion";
		}
		if (qux === 9) {
			x = "Chaos";
		}
		if (qux === 10) {
			x = "Corpse";
		}
		if (qux === 11) {
			x = "Corruption";
		}
		if (qux === 12) {
			x = "Cruel";
		}
		if (qux === 13) {
			x = "Death";
		}
		if (qux === 14) {
			x = "Demon";
		}
		if (qux === 15) {
			x = "Dire";
		}
		if (qux === 16) {
			x = "Dread";
		}
		if (qux === 17) {
			x = "Doom";
		}
		if (qux === 11) {
			x = "Eagle";
		}
		if (qux === 19) {
			x = "Entropy";
		}
		if (qux === 20) {
			x = "Fiend";
		}
		if (qux === 21) {
			x = "Gale";
		}
		if (qux === 22) {
			x = "Ghoul";
		}
		if (qux === 23) {
			x = "Glyph";
		}
		if (qux === 24) {
			x = "Grim";
		}
		if (qux === 25) {
			x = "Hailstone";
		}
		if (qux === 26) {
			x = "Havoc";
		}
		if (qux === 27) {
			x = "Imp";
		}
		if (qux === 28) {
			x = "Loath";
		}
		if (qux === 29) {
			x = "Order";
		}
		if (qux === 30) {
			x = "Pain";
		}
		if (qux === 31) {
			x = "Plague";
		}
		if (qux === 32) {
			x = "Raven";
		}
		if (qux === 33) {
			x = "Rift";
		}
		if (qux === 34) {
			x = "Rune";
		}
		if (qux === 35) {
			x = "Shadow";
		}
		if (qux === 36) {
			x = "Skull";
		}
		if (qux === 37) {
			x = "Soul";
		}
		if (qux === 38) {
			x = "Spirit";
		}
		if (qux === 39) {
			x = "Stone";
		}
		if (qux === 40) {
			x = "Storm";
		}
		if (qux === 41) {
			x = "Viper";
		}
		if (qux === 42) {
			x = "Wraith";
		}
		if (newItem === "helmet") {
			var bar = ~~(1 + Math.random() * (9));
			if (bar === 1) {
				y = "Brow";
			}
			if (bar === 2) {
				y = "Casque";
			}
			if (bar === 3) {
				y = "Cowl";
			}
			if (bar === 4) {
				y = "Crest";
			}
			if (bar === 5) {
				y = "Horn";
			}
			if (bar === 6) {
				y = "Mask";
			}
			if (bar === 7) {
				y = "Veil";
			}
			if (bar === 8) {
				y = "Visage";
			}
			if (bar === 9) {
				y = "Visor";
			}
		}
		if (newItem === "neck") {
			var bar = ~~(1 + Math.random() * (9));
			if (bar === 1) {
				y = "Beads";
			}
			if (bar === 2) {
				y = "Collar";
			}
			if (bar === 3) {
				y = "Gorget";
			}
			if (bar === 4) {
				y = "Heart";
			}
			if (bar === 5) {
				y = "Necklace";
			}
			if (bar === 6) {
				y = "Noose";
			}
			if (bar === 7) {
				y = "Scarab";
			}
			if (bar === 8) {
				y = "Talisman";
			}
			if (bar === 9) {
				y = "Torc";
			}
		}
		if (newItem === "ring") {
			var bar = ~~(1 + Math.random() * 16);
			if (bar === 1) {
				y = "Band";
			}
			if (bar === 2) {
				y = "Circle";
			}
			if (bar === 3) {
				y = "Coil";
			}
			if (bar === 4) {
				y = "Eye";
			}
			if (bar === 5) {
				y = "Finger";
			}
			if (bar === 6) {
				y = "Grasp";
			}
			if (bar === 7) {
				y = "Grip";
			}
			if (bar === 8) {
				y = "Gyre";
			}
			if (bar === 9) {
				y = "Hold";
			}
			if (bar === 10) {
				y = "Knuckle";
			}
			if (bar === 11) {
				y = "Loop";
			}
			if (bar === 12) {
				y = "Nails";
			}
			if (bar === 13) {
				y = "Spiral";
			}
			if (bar === 14) {
				y = "Touch";
			}
			if (bar === 15) {
				y = "Turn";
			}
			if (bar === 16) {
				y = "Whorl";
			}
		}
		if (newItem === "shoulders") {
			var bar = ~~(1 + Math.random() * (7));
			if (bar === 1) {
				y = "Tabard";
			}
			if (bar === 2) {
				y = "Bulkhead";
			}
			if (bar === 3) {
				y = "Drape";
			}
			if (bar === 4) {
				y = "Stout";
			}
			if (bar === 5) {
				y = "Clavicle";
			}
			if (bar === 6) {
				y = "Awning";
			}
			if (bar === 7) {
				y = "Shelter";
			}
		}
		if (newItem === "back") {
			var bar = ~~(1 + Math.random() * (7));
			if (bar === 1) {
				y = "Blind";
			}
			if (bar === 2) {
				y = "Guiser";
			}
			if (bar === 3) {
				y = "Manteau";
			}
			if (bar === 4) {
				y = "Capote";
			}
			if (bar === 5) {
				y = "Veneer";
			}
			if (bar === 6) {
				y = "Facade";
			}
			if (bar === 7) {
				y = "Talma";
			}
		}
		if (newItem === "chest") {
			var bar = ~~(1 + Math.random() * (7));
			if (bar === 1) {
				y = "Carapace";
			}
			if (bar === 2) {
				y = "Hide";
			}
			if (bar === 3) {
				y = "Jack";
			}
			if (bar === 4) {
				y = "Pelt";
			}
			if (bar === 5) {
				y = "Shroud";
			}
			if (bar === 6) {
				y = "Suit";
			}
			if (bar === 7) {
				y = "Wrap";
			}
		}
		if (newItem === "bracers") {
			var bar = ~~(1 + Math.random() * (8));
			if (bar === 1) {
				y = "Bracket";
			}
			if (bar === 2) {
				y = "Peg";
			}
			if (bar === 3) {
				y = "Grip";
			}
			if (bar === 4) {
				y = "Clamp";
			}
			if (bar === 5) {
				y = "Strut";
			}
			if (bar === 6) {
				y = "Splint";
			}
			if (bar === 7) {
				y = "Truss";
			}
			if (bar === 8) {
				y = "Vice";
			}
		}
		if (newItem === "gloves") {
			var bar = ~~(1 + Math.random() * (9));
			if (bar === 1) {
				y = "Claw";
			}
			if (bar === 2) {
				y = "Clutches";
			}
			if (bar === 3) {
				y = "Finger";
			}
			if (bar === 4) {
				y = "Fist";
			}
			if (bar === 5) {
				y = "Grasp";
			}
			if (bar === 6) {
				y = "Grip";
			}
			if (bar === 7) {
				y = "Hand";
			}
			if (bar === 8) {
				y = "Touch";
			}
			if (bar === 9) {
				y = "Knuckle";
			}
		}
		if (newItem === "belt") {
			var bar = ~~(1 + Math.random() * (10));
			if (bar === 1) {
				y = "Buckle";
			}
			if (bar === 2) {
				y = "Chain";
			}
			if (bar === 3) {
				y = "Clasp";
			}
			if (bar === 4) {
				y = "Cord";
			}
			if (bar === 5) {
				y = "Fringe";
			}
			if (bar === 6) {
				y = "Harness";
			}
			if (bar === 7) {
				y = "Lash";
			}
			if (bar === 8) {
				y = "Lock";
			}
			if (bar === 9) {
				y = "Strap";
			}
			if (bar === 10) {
				y = "Winding";
			}
		}
		if (newItem === "legs") {
			var bar = ~~(1 + Math.random() * (7));
			if (bar === 1) {
				y = "Muster";
			}
			if (bar === 2) {
				y = "Join";
			}
			if (bar === 3) {
				y = "Cowl";
			}
			if (bar === 4) {
				y = "Pillar";
			}
			if (bar === 5) {
				y = "Support";
			}
			if (bar === 6) {
				y = "Trestle";
			}
			if (bar === 7) {
				y = "Stud";
			}
		}
		if (newItem === "boots") {
			var bar = ~~(1 + Math.random() * (6));
			if (bar === 1) {
				y = "Treck";
			}
			if (bar === 2) {
				y = "Spur";
			}
			if (bar === 3) {
				y = "Fate";
			}
			if (bar === 4) {
				y = "Destiny";
			}
			if (bar === 5) {
				y = "Dare";
			}
			if (bar === 6) {
				y = "Hazard";
			}
		}
		if (newType === "slashed" || newType === "cleaved") {
			var bar = ~~(1 + Math.random() * 11);
			if (bar === 1) {
				y = "Barb";
			}
			if (bar === 2) {
				y = "Bite";
			}
			if (bar === 3) {
				y = "Cleaver";
			}
			if (bar === 4) {
				y = "Edge";
			}
			if (bar === 5) {
				y = "Fang";
			}
			if (bar === 6) {
				y = "Gutter";
			}
			if (bar === 7) {
				y = "Impaler";
			}
			if (bar === 8) {
				y = "Needle";
			}
			if (bar === 9) {
				y = "Razor";
			}
			if (bar === 10) {
				y = "Saw";
			}
			if (bar === 11) {
				y = "Scalpel";
			}
			if (bar === 12) {
				y = "Scratch";
			}
			if (bar === 13) {
				y = "Scythe";
			}
			if (bar === 14) {
				y = "Sever";
			}
			if (bar === 15) {
				y = "Skewer";
			}
			if (bar === 16) {
				y = "Song";
			}
			if (bar === 17) {
				y = "Stinger";
			}
			if (bar === 11) {
				y = "Thirst";
			}
		}
		if (newType === "crushed" || newType === "smashed" || newType === "staff") {
			var bar = ~~(1 + Math.random() * (12));
			if (bar === 1) {
				y = "Bane";
			}
			if (bar === 2) {
				y = "Blow";
			}
			if (bar === 3) {
				y = "Brand";
			}
			if (bar === 4) {
				y = "Break";
			}
			if (bar === 5) {
				y = "Crack";
			}
			if (bar === 6) {
				y = "Crusher";
			}
			if (bar === 7) {
				y = "Grinder";
			}
			if (bar === 8) {
				y = "Knell";
			}
			if (bar === 9) {
				y = "Mallet";
			}
			if (bar === 10) {
				y = "Ram";
			}
			if (bar === 11) {
				y = "Smasher";
			}
			if (bar === 12) {
				y = "Star";
			}
		}
		if (newType === "pierced") {
			var bar = ~~(1 + Math.random() * 17);
			if (bar === 1) {
				y = "Barb";
			}
			if (bar === 2) {
				y = "Branch";
			}
			if (bar === 3) {
				y = "Dart";
			}
			if (bar === 4) {
				y = "Fang";
			}
			if (bar === 5) {
				y = "Goad";
			}
			if (bar === 6) {
				y = "Gutter";
			}
			if (bar === 7) {
				y = "Impaler";
			}
			if (bar === 8) {
				y = "Lance";
			}
			if (bar === 9) {
				y = "Nails";
			}
			if (bar === 10) {
				y = "Needle";
			}
			if (bar === 11) {
				y = "Prod";
			}
			if (bar === 12) {
				y = "Scourge";
			}
			if (bar === 13) {
				y = "Scratch";
			}
			if (bar === 14) {
				y = "Skewer";
			}
			if (bar === 15) {
				y = "Spike";
			}
			if (bar === 16) {
				y = "Stinger";
			}
			if (bar === 17) {
				y = "Wrack";
			}
		}
		if (newType === "staff") {
			var bar = ~~(1 + Math.random() * (10));
			if (bar === 1) {
				y = "Branch";
			}
			if (bar === 2) {
				y = "Call";
			}
			if (bar === 3) {
				y = "Chant";
			}
			if (bar === 4) {
				y = "Cry";
			}
			if (bar === 5) {
				y = "Goad";
			}
			if (bar === 6) {
				y = "Gnarl";
			}
			if (bar === 7) {
				y = "Spell";
			}
			if (bar === 8) {
				y = "Spire";
			}
			if (bar === 9) {
				y = "Song";
			}
			if (bar === 10) {
				y = "Weaver";
			}
		}
		if (newType === "shield") {
			var bar = ~~(1 + Math.random() * (9));
			if (bar === 1) {
				y = "Badge";
			}
			if (bar === 2) {
				y = "Emblem";
			}
			if (bar === 3) {
				y = "Guard";
			}
			if (bar === 4) {
				y = "Mark";
			}
			if (bar === 5) {
				y = "Rock";
			}
			if (bar === 6) {
				y = "Tower";
			}
			if (bar === 7) {
				y = "Ward";
			}
			if (bar === 8) {
				y = "Wing";
			}
			if (bar === 9) {
				y = "Bulwark";
			}
		}
		if (newType === "offhand") {
			var bar = ~~(1 + Math.random() * (9));
			if (bar === 1) {
				y = "Globule";
			}
			if (bar === 2) {
				y = "Marble";
			}
			if (bar === 3) {
				y = "Star";
			}
			if (bar === 4) {
				y = "Crest";
			}
			if (bar === 5) {
				y = "Cycle";
			}
			if (bar === 6) {
				y = "Dust";
			}
			if (bar === 7) {
				y = "Smoke";
			}
			if (bar === 8) {
				y = "Void";
			}
			if (bar === 9) {
				y = "Tremor";
			}
		}
		if (newType === "range") {
			var bar = ~~(1 + Math.random() * (9));
			if (bar === 1) {
				y = "Bolt";
			}
			if (bar === 2) {
				y = "Thirst";
			}
			if (bar === 3) {
				y = "Fletch";
			}
			if (bar === 4) {
				y = "Flight";
			}
			if (bar === 5) {
				y = "Horn";
			}
			if (bar === 6) {
				y = "Nock";
			}
			if (bar === 7) {
				y = "Quarrel";
			}
			if (bar === 8) {
				y = "Quill";
			}
			if (bar === 9) {
				y = "Stinger";
			}
		}
		if (newType === "trinket") {
			var bar = ~~(1 + Math.random() * (7));
			if (bar === 1) {
				y = "Breaker";
			}
			if (bar === 2) {
				y = "Chant";
			}
			if (bar === 3) {
				y = "Cry";
			}
			if (bar === 4) {
				y = "Song";
			}
			if (bar === 5) {
				y = "Star";
			}
			if (bar === 6) {
				y = "Talisman";
			}
			if (bar === 7) {
				y = "Torc";
			}
		}
		foo = x + " " + y + " " + foo;
		return foo;
	}
}()