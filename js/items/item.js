var item;
var loot = {};
(function(_, Object, JSON, $, SteppedEase, TweenMax, undefined) {
	item = {
		handleDropSuccess,
		getItemNameString,
		getRarity,
		getItem,
		getLoot,
		resetDrop,
		toggleDrag,
		updateCursorImgPosition,
		buy,
		sell,
		destroy,
		handleItemSlotContextClick,
		getItemValueHtml,
		getFirstAvailableInvSlot,
		getPotion,
		getPotionUseMessage,
		getIdentifyScroll,
		lastDragEvent: {},
		lastDropEvent: {},
		isIdentifyMode: false,
		identifyScrollIndex: -1,
		identifyScrollType: '',
		config: {},
		goldValue: 0,
		MAX_SLOTS: {
			eq: 15,
			inv: 16,
			bank: 30,
			merchant: 24,
			blacksmith: 24,
			apothecary: 17,
			tavern: 24,
			tradeFrom: 4,
			tradeTo: 4,
		},
		allProps: [
			'offense',
			'defense',
			'oneHandSlash',
			'oneHandBlunt',
			'piercing',
			'archery',
			'handToHand',
			'twoHandSlash',
			'twoHandBlunt',
			'dualWield',
			'doubleAttack',
			'dodge',
			'parry',
			'riposte',
			'alteration',
			'conjuration',
			'evocation',
		],
		specialPropLabels: {
			oneHandSlash: 'One-hand Slash',
			oneHandBlunt: 'One-hand Blunt',
			handToHand: 'Hand-to-hand',
			twoHandSlash: 'Two-hand Slash',
			twoHandBlunt: 'Two-hand Blunt',
			dualWield: 'Dual Wield',
			doubleAttack: 'Double Attack',
		},
		isDragging: false,
		awaitingDrop: false,
		dragData: {},
		dropData: {},
		dragType: '',
		dropType: '',
		dragSlot: 0,
		dropSlot: 0,
		dragEqType: '',
		dropEqType: '',
		isContextClick: false,
		eqSlots: {
			helms: ['helms', void 0],
			amulets: ['amulets', void 0],
			ring1: ['rings', void 0],
			ring2: ['rings', void 0],
			shoulders: ['shoulders', void 0],
			cloaks: ['cloaks', void 0],
			chests: ['chests', void 0],
			bracers: ['bracers', void 0],
			gloves: ['gloves', void 0],
			belts: ['belts', void 0],
			legs: ['legs', void 0],
			boots: ['boots', void 0],
			primary: ['oneHandBlunts', 'oneHandSlashers', 'piercers', 'focus', 'twoHandBlunts', 'twoHandSlashers', 'staves', void 0],
			secondary: ['oneHandBlunts', 'oneHandSlashers', 'piercers', 'focus', 'shields', void 0],
			charms: ['charms', 'bows', void 0],
		},
		allWeaponTypes: ['oneHandBlunts', 'oneHandSlashers', 'piercers', 'focus', 'twoHandBlunts', 'twoHandSlashers', 'staves'],
		offhandWeaponTypes: ['oneHandBlunts', 'oneHandSlashers', 'piercers', 'focus'],
		twoHandWeaponTypes: ['twoHandBlunts', 'twoHandSlashers', 'staves'],
	}

	var html, key, value, mobName, buyItemSlot, filteredItems, itemObj, rarity, keys, filteredKeys, itemSlot, filteredItemsIndex, drop, len, prefixKeys, suffixKeys, possibleItems, itemIndexArray, i, itemIndex, uniqueItem, deletedProps, newSpeed, newArmor, newMinDamage, newMaxDamage, prefix, suffix, prefixVal, suffixVal, prefixName, suffixName, itemTypeMultiplier, tc, prefixMax, suffixMax, getPrefixSuffixComboType, rareKeys, numberOfProps, props, propType, val, potionValue

	const potionRecovers = [20,40,80,160,320,640]
	const potionMap = {
		WAR: { hp: 2, mp: 1, sp: 1 },
		SHD: { hp: 2, mp: 1.5, sp: 1 },
		CRU: { hp: 2, mp: 1.5, sp: 1.5 },
		MNK: { hp: 1.5, mp: 1.5, sp: 1.5 },
		ROG: { hp: 1.5, mp: 1.5, sp: 1.5 },
		RNG: { hp: 1.5, mp: 1.5, sp: 1.5 },
		BRD: { hp: 1.5, mp: 1.5, sp: 1.5 },
		DRU: { hp: 1.5, mp: 1.5, sp: 2 },
		CLR: { hp: 1.5, mp: 1.5, sp: 2 },
		SHM: { hp: 1.5, mp: 1.5, sp: 2 },
		NEC: { hp: 1, mp: 2, sp: 1.5 },
		ENC: { hp: 1, mp: 2, sp: 1.5 },
		SUM: { hp: 1, mp: 2, sp: 1.5 },
		WIZ: { hp: 1, mp: 2, sp: 1.5 },
	}
	// events
	$('#inventory')
		//.on('click', '#inventory-identify', preIdentifyItem)
		.on('click', '#inventory-destroy', dropItem)

	const identifyScroll = {
		name: 'Identification Scroll',
		use: true,
		itemType: 'scroll',
		itemSubType: 'identify',
		imgIndex: 0,
		cost: 10
	}
	const potions = {
		hp: [{
				name: 'Minor Health Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'hp',
				potionResource: 'health',
				imgIndex: 0,
				cost: 10
			}, {
				name: 'Light Health Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'hp',
				potionResource: 'health',
				imgIndex: 1,
				cost: 20
			}, {
				name: 'Health Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'hp',
				potionResource: 'health',
				imgIndex: 2,
				cost: 40
			}, {
				name: 'Major Health Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'hp',
				potionResource: 'health',
				imgIndex: 3,
				cost: 80
			}, {
				name: 'Greater Health Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'hp',
				potionResource: 'health',
				imgIndex: 4,
				cost: 160
			}, {
				name: 'Super Health Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'hp',
				potionResource: 'health',
				imgIndex: 5,
				cost: 320
			}
		],
		mp: [{
				name: 'Minor Mana Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'mp',
				potionResource: 'mana',
				imgIndex: 0,
				cost: 10
			}, {
				name: 'Light Mana Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'mp',
				potionResource: 'mana',
				imgIndex: 1,
				cost: 20
			}, {
				name: 'Mana Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'mp',
				potionResource: 'mana',
				imgIndex: 2,
				cost: 40
			}, {
				name: 'Major Mana Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'mp',
				potionResource: 'mana',
				imgIndex: 3,
				cost: 80
			}, {
				name: 'Greater Mana Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'mp',
				potionResource: 'mana',
				imgIndex: 4,
				cost: 160
			}, {
				name: 'Super Mana Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'mp',
				potionResource: 'mana',
				imgIndex: 5,
				cost: 320
			}
		],
		sp: [{
				name: 'Minor Spirit Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'sp',
				potionResource: 'spirit',
				imgIndex: 0,
				cost: 10
			}, {
				name: 'Light Spirit Potion',
				use: true,
				description: '',
				itemType: 'potion',
				itemSubType: 'sp',
				potionResource: 'spirit',
				imgIndex: 1,
				cost: 20
			}, {
				name: 'Spirit Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'sp',
				potionResource: 'spirit',
				imgIndex: 2,
				cost: 40
			}, {
				name: 'Major Spirit Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'sp',
				potionResource: 'spirit',
				imgIndex: 3,
				cost: 80
			}, {
				name: 'Greater Spirit Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'sp',
				potionResource: 'spirit',
				imgIndex: 4,
				cost: 160
			}, {
				name: 'Super Spirit Potion',
				use: true,
				itemType: 'potion',
				itemSubType: 'sp',
				potionResource: 'spirit',
				imgIndex: 5,
				cost: 320
			}
		],
	}
	const saleValues = {
		cost: 1,
		resistBlood: 2,
		resistPoison: 2,
		resistArcane: 2,
		resistLightning: 2,
		resistFire: 2,
		resistIce: 2,
		resistAll: 18,
		enhancedArmor: .1,
		enhancedDamage: .2,
		addSpellBlood: .5,
		addSpellPoison: .5,
		addSpellArcane: .5,
		addSpellLightning: .5,
		addSpellFire: .5,
		addSpellIce: .5,
		addSpellAll: 3,
		attack: .25,
		offense: 7,
		defense: 7,
		oneHandSlash: 7,
		oneHandBlunt: 7,
		piercing: 7,
		archery: 7,
		handToHand: 7,
		twoHandSlash: 7,
		twoHandBlunt: 7,
		dodge: 7,
		parry: 7,
		riposte: 7,
		alteration: 7,
		conjuration: 7,
		evocation: 7,
		allSkills: 350,
		str: 1.5,
		sta: 1.5,
		agi: 1.5,
		dex: 1.5,
		wis: 1.5,
		intel: 1.5,
		cha: 1.5,
		allStats: 24,
		hp: .4,
		hpRegen: 3,
		mp: .4,
		mpRegen: 3,
		sp: .4,
		spRegen: 3,
		crit: 1.5,
		leech: 2,
		wraith: 2,
		haste: 24,
		addBlood: .3,
		addPoison: .3,
		addArcane: .3,
		addLightning: .3,
		addFire: .3,
		addIce: .3,
		increasedBlock: .3,
		damageTakenToMana: .5,
		damageTakenToSpirit: .5,
		enhancedDamageToHumanoids: 2,
		enhancedDamageToBeasts: 2,
		enhancedDamageToUndead: 2,
		enhancedDamageToDemons: 2,
		enhancedDamageToDragonkin: 2,
		enhancedDamageToEldritch: 2,
		phyMit: 3,
		magMit: 3,
		resistPhysical: 6,
		enhanceBlood: 2.5,
		enhancePoison: 2.5,
		enhanceArcane: 2.5,
		enhanceLightning: 2.5,
		enhanceFire: 2.5,
		enhanceIce: 2.5,
		enhanceAll: 15,
		resistParalyze: 2,
		resistFear: 2,
		resistStun: 2,
		resistSilence: 2,
		reduceHealing: 4,
		restInPeace: 70,
		slowsTarget: 7,
		reduceTargetArmor: 2.5,
		ignoreTargetArmor: 50,
		increaseHpPercent: 3,
		increaseMpPercent: 3,
		hpKill: 2.5,
		mpKill: 2.5,
		spKill: 2.5,
		minDamage: .5,
		maxDamage: .5,
		armor: 2,
		blockRate: .3,
	}
	const slotRequiresMagic = [
		'rings',
		'amulets',
		'charms',
	]
	const myItemTypes = ['eq', 'inv', 'bank']
	const equipmentSlotIndex = {
		'amulets': 1,
		'belts': 9,
		'boots': 11,
		'bows': 14,
		'bracers': 7,
		'charms': 14,
		'chests': 6,
		'cloaks': 5,
		'focus': 12,
		'gloves': 8,
		'helms': 0,
		'legs': 10,
		'oneHandBlunts': 12,
		'oneHandSlashers': 12,
		'piercers': 12,
		'rings': 2,
		'shields': 13,
		'shoulders': 4,
		'staves': 12,
		'twoHandBlunts': 12,
		'twoHandSlashers': 12,
	}
	const equipmentEqTypeIndex = {
		'amulets': 'amulets',
		'belts': 'belts',
		'boots': 'boots',
		'bows': 'charms',
		'bracers': 'bracers',
		'charms': 'charms',
		'chests': 'chests',
		'cloaks': 'cloaks',
		'focus': 'primary',
		'gloves': 'gloves',
		'helms': 'helms',
		'legs': 'legs',
		'oneHandBlunts': 'primary',
		'oneHandSlashers': 'primary',
		'piercers': 'primary',
		'rings': 'ring1',
		'shields': 'secondary',
		'shoulders': 'shoulders',
		'staves': 'primary',
		'twoHandBlunts': 'primary',
		'twoHandSlashers': 'primary',
	}
	item.eqSlotKeys = Object.keys(item.eqSlots)
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
		dualWield: function(val, multi) {
			if (val <= 1 * multi) { return 'Adept\'s' }
			else if (val <= 2 * multi) { return 'Expert\'s' }
			else { return 'Savant\'s' }
		},
		doubleAttack: function(val, multi) {
			if (val <= 1 * multi) { return 'Dueler\'s' }
			else if (val <= 2 * multi) { return 'Zealot\'s' }
			else { return 'Maniac\'s' }
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
		enhancedArmor: 25,
		enhancedDamage: 50,
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
		increasedBlock: 2,
		resistParalyze: 2,
		resistFear: 2,
		resistStun: 2,
		resistSilence: 2,
	}
	var rarePrefixNames = ['Beast', 'Armageddon', 'Fiend', 'Bitter', 'Blood', 'Bone', 'Bramble', 'Brimstone', 'Carrion', 'Chaos', 'Corpse', 'Corruption', 'Cruel', 'Death', 'Demon', 'Dire', 'Dread', 'Doom', 'Eagle', 'Entropy', 'Wraith', 'Gale', 'Ghoul', 'Glyph', 'Grim', 'Hailstone', 'Havoc', 'Imp', 'Loath', 'Order', 'Pain', 'Plague', 'Raven', 'Rift', 'Rune', 'Shadow', 'Skull', 'Soul', 'Beast', 'Spirit', 'Stone', 'Storm', 'Viper']
	var rareSuffixNames = {
		helms: ['Brow', 'Casque', 'Cowl', 'Crest', 'Horn', 'Mask', 'Veil', 'Visage', 'Visor'],
		amulets: ['Beads', 'Collar', 'Gorget', 'Heart', 'Necklace', 'Noose', 'Scarab', 'Talisman', 'Torc'],
		rings: ['Band', 'Circle', 'Coil', 'Eye', 'Finger', 'Grasp', 'Grip', 'Gyre', 'Hold', 'Knuckle', 'Loop', 'Nails', 'Spiral', 'Touch', 'Turn', 'Whorl'],
		shoulders: ['Tabard', 'Bulkhead', 'Drape', 'Stout', 'Clavicle', 'Awning', 'Shelter'],
		cloaks: ['Blind', 'Guiser', 'Manteau', 'Capote', 'Veneer', 'Facade', 'Talma'],
		chests: ['Carapace', 'Hide', 'Jack', 'Pelt', 'Shroud', 'Suit', 'Wrap'],
		bracers: ['Bracket', 'Peg', 'Grip', 'Clamp', 'Strut', 'Splint', 'Truss', 'Vice'],
		gloves: ['Claw', 'Clutches', 'Finger', 'Fist', 'Grasp', 'Grip', 'Hand', 'Touch', 'Knuckle'],
		belts: ['Buckle', 'Chain', 'Clasp', 'Cord', 'Fringe', 'Harness', 'Lash', 'Lock', 'Strap', 'Winding'],
		legs: ['Muster', 'Join', 'Cowl', 'Pillar', 'Support', 'Trestle', 'Stud'],
		boots: ['Trek', 'Spur', 'Fate', 'Destiny', 'Dare', 'Hazard', 'March'],
		oneHandSlashers: ['Barb', 'Bite', 'Cleaver', 'Edge', 'Fang', 'Gutter', 'Impaler', 'Needle', 'Razor'],
		twoHandSlashers: ['Saw', 'Scalpel', 'Divide', 'Scythe', 'Sever', 'Skewer', 'Song', 'Stinger', 'Tear'],
		oneHandBlunts: ['Bane', 'Blow', 'Brand', 'Break', 'Crack', 'Star', 'Grinder', 'Knell', 'Mallet'],
		twoHandBlunts: ['Ram', 'Smasher', 'Wrecker', 'Trunk', 'Stalk', 'Crusher', 'Ruin', 'Devastator', 'Ruiner'],
		piercers: ['Barb', 'Branch', 'Dart', 'Fang', 'Goad', 'Gutter', 'Impaler', 'Lance', 'Nails', 'Needle', 'Prod', 'Scourge', 'Scratch', 'Skewer', 'Spike', 'Stinger'],
		staves: ['Branch', 'Call', 'Chant', 'Cry', 'Goad', 'Gnarl', 'Spell', 'Spire', 'Song', 'Weaver'],
		focus: ['Globule', 'Marble', 'Star', 'Crest', 'Cycle', 'Dust', 'Smoke', 'Void', 'Tremor'],
		bows: ['Bolt', 'Thirst', 'Fletch', 'Flight', 'Horn', 'Nock', 'Quarrel', 'Quill', 'Stinger'],
		shields: ['Badge', 'Emblem', 'Guard', 'Mark', 'Rock', 'Tower', 'Ward', 'Wing', 'Bulwark', 'Bastion', 'Redoubt', 'Citadel'],
		charms: ['Breaker', 'Chant', 'Cry', 'Song', 'Star', 'Talisman', 'Torc', 'Memento'],
	}
	/////////////////////////////////////////////////////////////////

	function getPotionUseMessage(obj) {
		return 'Recover '+ potionRecoveryByJob(obj.itemSubType, obj.imgIndex) +' '+ obj.potionResource +' over 6 seconds'
	}

	function potionRecoveryByJob(type, index) {
		return potionRecovers[index] * potionMap[my.job][type]
	}

	function getEquipString() {
		// cloth, leather, mail, plate, weapon types should show red if you can't use it
	}
	function getRarity(bonus = 0) {
		/*'normal',
			'magic',
			'rare',
			'set',
			'unique',
			'runic',
			'legendary',*/
		var resp = 'normal'
		var randBase = _.random(1, 100)
		var rand = randBase + bonus
		// unique bonuses are halved
		var uniqueRand = randBase + (bonus * .5)

		//console.info('getRarity', rand);
		if (uniqueRand >= 97) {
			resp = 'unique'
		}
		else if (rand >= 75) {
			resp = 'rare'
		}
		else if (rand >= 20) {
			resp = 'magic'
		}
		return resp;
	}
	function getItemNameString(drop, baseName, noBrackets) {
		return '<span class="item-'+ drop.rarity +'">' + (noBrackets ? '' : '[') +
			(baseName ? baseName : drop.name) +
		(noBrackets ? '' : ']') + '</span>'
	}
	function getFirstAvailableInvSlot() {
		var index = items.inv.findIndex(slot => !slot.name)
		if (index > -1) items.inv[index].name = 'Loading'
		return index
	}
	function getFirstUnidentifiedItemSlot() {
		return items.inv.findIndex(slot => slot.unidentified)
	}
	function getLoot(config, mobSlot) {
		var slot = getFirstAvailableInvSlot()
		if (slot === -1) {
			chat.log('You have no room in your inventory!')
			return
		}
		handleDragStart()
		var drop = item.getItem(config)
		console.info('getLoot', drop)
		$.post(app.url + 'item/loot-item.php', {
			slot: slot,
			name: drop.name,
			data: JSON.stringify(_.omit(drop, ['name'])),
		}).done(data => {
			processNewItemToInv({
				slot: slot,
				itemData: drop,
				row: data,
			})
			mobName = _.get(mob[mobSlot], 'name', 'You discovered an item: ')
			chat.log(mobName + getItemNameString(drop, drop.baseName))
		}).fail(function() {
			items.inv[slot] = {}
		}).always(handleDropAlways)
	}
	function getItem(config) {
		/**
		 * store: boolean to disable unidentified items
		 * mobLevel: int = 1-max sets max possible item level
		 * bonus: int = provides a boost to finding great items 10 is high
		 * rarity: string = forces a rarity type
		 * itemSlot: forces a particular item slot
		 * itemName: forces specific sub item based on base name
		 * armorTypes: filter by armorType for armor slots
		 */
		if (!config) config = { mobLevel: 1 }
		if (config.bonus === void 0) config.bonus = 0
		if (config.mobLevel === void 0) config.mobLevel = 1
		item.config = config
		rarity = item.config.rarity || getRarity(item.config.bonus)
		// set item type (normal, magic, etc)
		//console.info('getRarity', rarity)
		keys = Object.keys(loot)
		// get possible slotTypes (helms, chests) based on rarity
		filteredKeys = _.filter(keys, filterKeys)
		//console.info('filteredKeys', filteredKeys)

		if (item.config.itemSlot && filteredKeys.includes(item.config.itemSlot)) {
			itemSlot = item.config.itemSlot
		}
		else {
			// pick one of the possible slotTypes
			itemSlot = filteredKeys[_.random(0, filteredKeys.length - 1)]
		}
		// clone item and then figure out what to grab
		itemObj = _.cloneDeep(loot[itemSlot])
		//console.info('itemObj', rarity, itemObj)
		if (!itemObj.normal[0].imgIndex) {
			// enrich with imgIndex data with natural index - a default for latter imgIndex function
			filteredItems = _.each(itemObj.normal, enrichImgIndex)
		}

		// get base items filtered by mob level
		filteredItems = _.filter(itemObj.normal, filterItems)
		// console.warn('filteredItems', _.cloneDeep(filteredItems))
		// filter by armor type if passed in config
		if (item.config.armorTypes) {
			filteredItems = _.filter(filteredItems, filterByArmorType)
		 	//console.warn('filteredItems after', _.cloneDeep(filteredItems))
		}
		var filteredItemsLen = filteredItems.length

		// pick one of the items from the array
		if (item.config.itemName) {
			// specific item
			filteredItemsIndex = _.findIndex(filteredItems, item => item.name === item.config.itemName)
			//console.warn('filteredItemsIndex', filteredItemsIndex)
		}
		else {
			// random item of type
			filteredItemsIndex = _.random(0, filteredItemsLen - 1)
		}
		//console.info('picked item: ', filteredItems[filteredItemsIndex])
		// combine itemSlot base props with base item
		drop = {
			...itemObj.base,
			...filteredItems[filteredItemsIndex]
		}
		setItemImageIcon()
		drop.baseName = drop.name

		// check defense range
		if (drop.minArmor) {
			drop.armor = _.random(drop.minArmor, drop.maxArmor)
			delete drop.minArmor
			delete drop.maxArmor
		}
		drop.rarity = rarity
		drop.itemType = itemSlot
		// magic
		if (rarity === 'unique') {
			len = getUniqueItemCount(drop);
			console.info('getUniqueItemCount', len);
			if (len) {
				processUniqueDrop(drop)
			}
			else {
				// no base item found - downgrade to rare
				drop.rarity = rarity = 'rare'
			}
		}

		if (rarity === 'magic' || rarity === 'rare') {
			preProcessDrop(drop)
			deleteWeaponSpecificProps(drop.itemType)
			// determine keys
			prefixKeys = Object.keys(itemObj.prefix)
			suffixKeys = Object.keys(itemObj.suffix)

			//console.info('rarity', rarity)
			if (rarity === 'magic') {
				processMagicDrop(drop)
			}
			else if (rarity === 'rare') {
				processRareDrop(drop)
			}
			// post-process item
		}
		if (!config.store && rarity !== 'normal') {
			drop.unidentified = true
		}
		postProcessDrop(drop)
		return drop;
	}
	function processRareDrop(drop) {
		rareKeys = _.uniq(_.concat(
			prefixKeys,
			suffixKeys,
			Object.keys(itemObj.rare)
		))
		numberOfProps = _.random(3, 6)
		// console.info('rare drop', drop, config)
		// get prefix and suffix
		props = []
		tc = getTreasureClass(item.config.mobLevel)
		for (i=0; i<numberOfProps; i++) {
			props[i] = getRareProp()
		}
		// console.warn('props', props)

		// assign property values
		props.forEach(function(prop) {
			drop[prop.key] = prop.val
		})
		drop.name = getRareName(drop.itemType, drop.name)
	}

	function getRareProp() {
		key = rareKeys[_.random(0, rareKeys.length - 1)]
		propType = getPropType(key)
		val = _.random(minValue[key], setMaxPropValue(itemObj[propType], key, tc))
		stripRareKeys(rareKeys, key)
		return {
			key: key,
			val: val
		}
	}
	function getPropType(prop) {
		if (_.get(itemObj.prefix, prop)) return 'prefix'
		else if (_.get(itemObj.suffix, prop)) return 'suffix'
		else return 'rare'
	}
	function processMagicDrop(drop) {
		/*console.info('magic drop', drop, config)
		console.info('prefixKeys', prefixKeys)
		console.info('suffixKeys', suffixKeys)*/
		// get prefix and suffix
		prefix = prefixKeys[_.random(0, prefixKeys.length - 1)]
		suffix = suffixKeys[_.random(0, suffixKeys.length - 1)]
		// get values and names
		prefixVal = 0
		suffixVal = 0
		prefixName = ''
		suffixName = ''
		itemTypeMultiplier = getMultiplierByTypeAndProp(drop.itemType)
		//TODO: unlock props by treasure class? Need data object for it
		//TODO: Add rare props - refactor for easy code reuse
		//console.warn('config', item.config.mobLevel)
		//console.info('itemObj', itemObj)
		tc = getTreasureClass(item.config.mobLevel)
		// set prefix and bound check
		prefixMax = setMaxPropValue(itemObj.prefix, prefix, tc)
		// set suffix and bound check
		suffixMax = setMaxPropValue(itemObj.suffix, suffix, tc)
		/*console.info('infos', item.config.mobLevel, tc, prefix, prefixMax, suffix, suffixMax)
		console.warn('max ', prefixMax, suffixMax)*/

		getPrefixSuffixComboType = _.random(1, 100)
		//console.info('prefix', prefix)
		if (getPrefixSuffixComboType <= 50) {
			prefixVal = _.random(minValue[prefix], prefixMax);
			prefixName = prefixNames[prefix](prefixVal, itemTypeMultiplier)
		}
		else if (getPrefixSuffixComboType <= 75) {
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

		if (app.isApp) {
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
		drop.name = [
			prefixName,
			drop.name,
			suffixName
		].join(' ').trim()
		return drop
	}
	function preProcessDrop() {
		// set possible prefixes, suffixes, rare arrays and remove weapon specific props
		itemObj.prefix = convertProps(itemObj.prefix)
		itemObj.suffix = convertProps(itemObj.suffix)
		itemObj.rare = convertProps(itemObj.rare)
	}
	function postProcessDrop(drop) {
		// some props require further processing
		if (drop.haste) {
			newSpeed = (drop.speed - (drop.speed * (drop.haste / 100))).toFixed(1)
			// console.warn('new speed:', drop.speed, newSpeed)
			drop.speed = newSpeed * 1
		}
		if (drop.enhancedArmor) {
			newArmor = (drop.armor + (drop.armor * (drop.enhancedArmor / 100))).toFixed(1)
			drop.armor = _.round(newArmor * 1)
		}
		if (drop.enhancedDamage) {
			newMinDamage = (drop.minDamage + (drop.minDamage * (drop.enhancedDamage / 100))).toFixed(1) * 1
			newMaxDamage = (drop.maxDamage + (drop.maxDamage * (drop.enhancedDamage / 100))).toFixed(1) * 1
			drop.minDamage = _.round(newMinDamage)
			drop.maxDamage = _.round(newMaxDamage)
		}
	}

	function filterKeys(key) {
		if (rarity === 'normal') {
			return !slotRequiresMagic.includes(key)
		}
		else {
			return true;
		}
	}

	function deleteWeaponSpecificProps(itemType) {
		//console.warn('deleteWeaponSpecificProps', itemType, itemObj.prefix)
		deletedProps = []
		if (itemType === 'oneHandSlashers') {
			deletedProps = [
				'oneHandBlunt',
				'piercing',
				'archery',
				'handToHand',
				'twoHandSlash',
				'twoHandBlunt',
			]
		}
		else if (itemType === 'oneHandBlunts' || itemType === 'focus') {
			deletedProps = [
				'oneHandSlash',
				'piercing',
				'archery',
				'handToHand',
				'twoHandSlash',
				'twoHandBlunt',
			]
		}
		else if (itemType === 'piercers') {
			deletedProps = [
				'oneHandSlash',
				'oneHandBlunt',
				'archery',
				'handToHand',
				'twoHandSlash',
				'twoHandBlunt',
			]
		}
		else if (itemType === 'twoHandSlashers') {
			deletedProps = [
				'oneHandSlash',
				'oneHandBlunt',
				'piercing',
				'archery',
				'handToHand',
				'twoHandBlunt',
			]
		}
		else if (itemType === 'twoHandBlunts' || itemType === 'staves') {
			deletedProps = [
				'oneHandSlash',
				'oneHandBlunt',
				'piercing',
				'archery',
				'handToHand',
				'twoHandSlash',
			]
		}
		else if (itemType === 'bows') {
			deletedProps = [
				'oneHandSlash',
				'oneHandBlunt',
				'piercing',
				'handToHand',
				'twoHandSlash',
				'twoHandBlunt',
			]
		}
		deletedProps.forEach(deleteItemProp)
	}
	function deleteItemProp(prop) {
		delete itemObj.prefix[prop]
	}
	function getMultiplierByTypeAndProp(itemType) {
		return (itemType === 'twoHandSlashers' ||
			itemType === 'twoHandBlunts' ||
			itemType === 'staves' ||
			itemType === 'bows') ? 2 : 1
	}
	function processUniqueDrop(drop) {
		// select one if more than one exists
		possibleItems = _.filter(loot[drop.itemType].unique, item => item.name === drop.name)
		len = possibleItems.length
		// console.info('possibleItems', possibleItems)
		if (len > 1) {
			itemIndexArray = []
			possibleItems.forEach(processOdds)

			itemIndex = itemIndexArray[_.random(0, itemIndexArray.length - 1)]
			uniqueItem = _.cloneDeep(possibleItems[itemIndex])
		}
		else {
			uniqueItem = _.cloneDeep(possibleItems[0])
		}
		processUniqueProps(uniqueItem, drop)
		//console.warn('uniqueItem drop', drop)
	}
	function processOdds(item, index) {
		// default to equal chance dropping for all unique items in this item type
		item.odds = item.odds || 100
		// console.info('odds', item.odds)
		for (i = 0; i < item.odds; i++) {
			itemIndexArray.push(index)
		}
	}
	function processUniqueProps(uniqueItem, drop) {
		// remove old
		uniqueItem.name = uniqueItem.newName
		delete uniqueItem.newName
		delete uniqueItem.odds
		// add props
		for (key in uniqueItem) {
			if (_.isArray(uniqueItem[key])) {
				drop[key] = _.random(uniqueItem[key][0], uniqueItem[key][1])
			}
			else drop[key] = uniqueItem[key]
		}
	}
	function getUniqueItemCount(newDrop) {
		if (_.isArray(loot[newDrop.itemType].unique)) {
			return _.filter(loot[newDrop.itemType].unique, it => it.name === newDrop.name).length
		}
		else return 0
	}
	function setItemImageIcon() {
		if (itemSlot === 'amulets') drop.imgIndex = _.random(0, 7)
		else if (itemSlot === 'rings') drop.imgIndex = _.random(0, 7)
		else if (itemSlot === 'charms') drop.imgIndex = _.random(0, 7)
		else drop.imgIndex = drop.imgIndex
	}
	function filterByArmorType(drop) {
		if (drop.armorType && drop.minArmor) {
			return item.config.armorTypes.includes(drop.armorType)
		}
		else return drop
	}
	function filterItems(drop) {
		return drop.itemLevel <= item.config.mobLevel
	}
	function enrichImgIndex(drop, index) {
		drop.imgIndex = index
	}

	function stripRareKeys(rareKeys, key) {
		// if this prop exists, these other props cannot exist
		// resists
		if (key === 'resistBlood') _.pull(rareKeys, 'resistPoison', 'resistAll')
		if (key === 'resistPoison') _.pull(rareKeys, 'resistBlood', 'resistAll')
		if (key === 'resistArcane') _.pull(rareKeys, 'resistLightning', 'resistAll')
		if (key === 'resistLightning') _.pull(rareKeys, 'resistArcane', 'resistAll')
		if (key === 'resistFire') _.pull(rareKeys, 'resistIce', 'resistAll')
		if (key === 'resistIce') _.pull(rareKeys, 'resistFire', 'resistAll')
		if (key === 'resistAll') _.pull(rareKeys, 'resistBlood', 'resistPoison', 'resistArcane', 'resistLightning', 'resistFire', 'resistIce')

		// spell power
		if (key === 'addSpellBlood') _.pull(rareKeys, 'addSpellPoison', 'addSpellAll')
		if (key === 'addSpellPoison') _.pull(rareKeys, 'addSpellBlood', 'addSpellAll')
		if (key === 'addSpellArcane') _.pull(rareKeys, 'addSpellLightning', 'addSpellAll')
		if (key === 'addSpellLightning') _.pull(rareKeys, 'addSpellArcane', 'addSpellAll')
		if (key === 'addSpellFire') _.pull(rareKeys, 'addSpellIce', 'addSpellAll')
		if (key === 'addSpellIce') _.pull(rareKeys, 'addSpellFire', 'addSpellAll')
		if (key === 'addSpellAll') _.pull(rareKeys, 'addSpellBlood', 'addSpellPoison', 'addSpellArcane', 'addSpellLightning', 'addSpellFire', 'addSpellIce')

		// skills
		if (key === 'attack' ||
			key === 'offense' ||
			key === 'defense' ||
			key === 'oneHandSlash' ||
			key === 'oneHandBlunt' ||
			key === 'piercing' ||
			key === 'archery' ||
			key === 'handToHand' ||
			key === 'twoHandSlash' ||
			key === 'twoHandBlunt' ||
			key === 'dodge' ||
			key === 'parry' ||
			key === 'riposte' ||
			key === 'alteration' ||
			key === 'conjuration' ||
			key === 'evocation'
		) {
			_.pull(rareKeys, 'allSkills')
		}
		if (key === 'allSkills') _.pull(rareKeys, 'attack', 'offense', 'defense', 'oneHandSlash', 'oneHandBlunt', 'piercing', 'archery', 'handToHand', 'twoHandSlash', 'twoHandBlunt', 'dodge', 'parry', 'riposte', 'alteration', 'conjuration', 'evocation')

		// attributes
		if (key === 'str' ||
			key === 'sta' ||
			key === 'agi' ||
			key === 'dex' ||
			key === 'wis' ||
			key === 'intel' ||
			key === 'cha') {
			_.pull(rareKeys, 'allStats')
		}
		if (key === 'allStats') _.pull(rareKeys, 'str', 'sta', 'agi', 'dex', 'wis', 'intel', 'cha')

		// added magic melee damage
		if (key === 'addIce') _.pull(rareKeys, 'addFire')
		if (key === 'addFire') _.pull(rareKeys, 'addIce')
		if (key === 'addBlood') _.pull(rareKeys, 'addPoison')
		if (key === 'addPoison') _.pull(rareKeys, 'addBlood')
		if (key === 'addArcane') _.pull(rareKeys, 'addLightning')
		if (key === 'addLightning') _.pull(rareKeys, 'addArcane')

		// always pull out prop key
		_.pull(rareKeys, key)
	}
	function setMaxPropValue(obj, key, tc) {
		var MAX_TREASURE_CLASS = 45
		//console.info('set max', obj)
		//console.info('setMaxPropValue', obj[key], key, tc)
		var val = (obj[key] * (tc / MAX_TREASURE_CLASS)) - minValue[key]
		if (val < minValue[key]) { val = minValue[key] }
		return _.round(val)
	}
	function getTreasureClass(tc) {
		if (tc > 45) {
			tc = 45
		}
		else if (tc < 3) {
			tc = 3
		}
		return _.round(tc)
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
				newProps = item.allProps
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
	function getRareName(itemType, baseName) {
		var prefix = rarePrefixNames[_.random(0, rarePrefixNames.length - 1)]
		var suffix = rareSuffixNames[itemType][_.random(0, rareSuffixNames[itemType].length - 1)]
		return [
			prefix,
			suffix,
			baseName
		].join(' ')
	}

	function toggleDrag(event) {
		if (ng.view === 'battle') {
			chat.log('You cannot adjust your equipment or inventory while in combat!', 'chat-warning')
			return
		}
		if (item.awaitingDrop) return
		var index = event.currentTarget.dataset.index * 1
		var type = event.currentTarget.dataset.type
		if (trade.data.name) {
			if (type === 'eq') {
				if (item.isDragging) chat.log('It would be unseemly to change your clothes while trading.', 'chat-warning')
				else chat.log('You cannot trade items you are wearing!', 'chat-warning')
				return
			}
			if (type === 'tradeTo') {
				chat.log('You cannot drop items to ' + trade.data.name + '\'s trade slots!', 'chat-warning')
				return
			}
			if (type === 'tradeFrom' && items[type][index].name) {
				if (item.isIdentifyMode) chat.log('You cannot identify items in the trade window.', 'chat-warning')
				else chat.log('You cannot drag items out of the trade window.', 'chat-warning')
				return
			}
		}

		if (item.isIdentifyMode) {
			if (type === 'inv' || type === 'bank' &&
				items[type][index].unidentified) {
				warn(item.identifyScrollIndex, item.identifyScrollType, index, type)
				identifyItem(item.identifyScrollIndex, item.identifyScrollType, index, type)
			}
			else {
				chat.log('That item does not need to be identified.', 'chat-warning')
				toggleIdentifyMode()
			}
			return
		}

		//console.info('toggleDrag', type, index)
		if (item.isDragging) {
			if (!myItemTypes.includes(item.dragType)) {
				// I don't own this item
				console.warn('isDragging a ', item.dragType, type)
				if (myItemTypes.includes(type)) {
					// dropped to store slot
					ng.msg('You must purchase that item before putting it in your inventory!', 4)
				}
				resetDrop()
				return
			}

			item.dropEqType = event.currentTarget.dataset.eqType
			if (item.dragSlot === index &&
				item.dragType === type) {
				// check for same item
				resetDrop()
				toast.hideDestroyToast()
				tooltip.handleItemEnter(event)
				return
			}
			item.dropData = items[type][index]
			item.dropSlot = index
			item.dropType = type
			// validate drop is valid
			if (!itemSwapValid(item.dragData, item.dropData)) {
				//TODO: audio
				item.isContextClick = false
				resetDrop()
				return
			}
			item.lastDropEvent = event
			if (item.dropData.name) {
				// swap
				if (myItemTypes.includes(item.dropType)) {
					handleDragStart()
					toast.hideDestroyToast()
					$.post(app.url + 'item/swap-items.php', {
						dragRow: item.dragData.row,
						dragSlot: item.dropSlot,
						dragType: item.dropType,
						dropRow: item.dropData.row,
						dropSlot: item.dragSlot,
						dropType: item.dragType,
					}).done(handleDropSuccess)
						.fail(handleDropFail)
						.always(handleDropAlways)
				}
				else trade.droppedItem()
			}
			else {
				// update
				if (myItemTypes.includes(item.dropType)) {
					handleDragStart()
					toast.hideDestroyToast()
					$.post(app.url + 'item/update-item.php', {
						dragRow: item.dragData.row,
						dragSlot: item.dropSlot,
						dragType: item.dropType,
						dropType: item.dragType,
					}).done(handleDropSuccess)
						.fail(handleDropFail)
						.always(handleDropAlways)
				}
				else trade.droppedItem()
			}
		}
		else {
			item.lastDragEvent = event
			tooltip.handleItemLeave(event)
			item.dragEqType = event.currentTarget.dataset.eqType
			console.info('dragEQ dragEqType', event.currentTarget.dataset)
			// drag
			item.dropData = {}
			if (items[type][index].name) {
				item.dragData = items[type][index]
				item.dragSlot = index
				item.dragType = type
				town.showMerchantMsg()
				if (town.isMerchantMode() &&
					item.lastDragEvent.ctrlKey) {
					if (item.dragType === 'inv' || item.dragType === 'eq') item.sell()
					else item.buy()
					return
				}

				showCursorImg(type, index)
			}
			console.warn("drag row data: ", type, index, item.dragData.row)
			if (item.dragData.name) item.isDragging = true
			else resetDrop()
		}
	}
	function handleDropSuccess() {
		items[item.dropType][item.dropSlot] = item.dragData
		items[item.dragType][item.dragSlot] = item.dropData
		bar.updateItemSwapDOM()
		resetDrop()
		warn('lastDragEvent', item.lastDragEvent)
		if (item.isContextClick) tooltip.handleItemEnter(item.lastDragEvent)
		else tooltip.handleItemEnter(item.lastDropEvent)
	}

	function showCursorImg(type, index) {
		updateCursorImgPosition()
		dom.itemTooltipCursorImg.style.visibility = 'visible'
		dom.itemTooltipCursorImg.src = bar.getItemSlotImage(type, index)
		TweenMax.to(dom.itemTooltipCursorImg, .5, {
			startAt: {
				filter: 'saturate(3) brightness(3)',
			},
			filter: 'saturate(1) brightness(1)',
		})
	}

	function updateCursorImgPosition() {
		dom.itemTooltipCursorImg.style.transform =
			'translate('+ (my.mouse.x - (32 * ng.responsiveRatio)) +'px, '+ (my.mouse.y - (28 * ng.responsiveRatio)) +'px)'
	}
	function itemSwapValid(drag, drop) {
		var resp = false;
		console.info('dragEqType', item.dragEqType)
		console.info('dropEqType', item.dropEqType)
		console.info('drag', item.dragData)
		console.info('drop', item.dropData)

		if (item.dragType !== 'eq' && item.dropType !== 'eq') {
			resp = true
			console.info('no equipment items - all good!')
		}
		else {
			console.warn('drag 1 itemType', drag.itemType, 'to slot', item.dropEqType)
			console.warn('drag 2 itemType', drop.itemType, 'to slot', item.dragEqType)

			if (eqDropValid(drag.itemType, item.dropEqType, drag.itemLevel, drag.unidentified) &&
				eqDropValid(drop.itemType, item.dragEqType, drop.itemLevel, drop.unidentified)) {
				resp = true
			}
		}

		return resp;
	}

	function eqDropValid(itemType, eqType, itemLevel, unidentified) {
		if (unidentified) {
			chat.log('You cannot equip unidentified items! Try buying an Identify Scroll from the merchant.', 'chat-warning')
			return false
		}
		console.info('itemLevel', my.level, itemLevel)
		if (my.level < itemLevel) {
			chat.log('Your level is not high enough to equip this item!', 'chat-warning')
			return false
		}
		// weapon checks
		if (eqType === 'primary' || eqType === 'secondary' &&
			item.allWeaponTypes.includes(itemType)) {
			// check character can equip a weapon
			if (itemType === 'oneHandSlashers' && !stats.oneHandSlash() ||
				itemType === 'oneHandBlunts' && !stats.oneHandBlunt() ||
				itemType === 'twoHandSlashers' && !stats.twoHandSlash() ||
				itemType === 'twoHandBlunts' && !stats.twoHandBlunt() ||
				itemType === 'piercing' && !stats.piercing() ||
				itemType === 'bows' && !stats.archery()) {
				chat.log('You cannot equip this type of weapon!', 'chat-warning')
				return false
			}
		}

		if (eqType === 'secondary' &&
			item.offhandWeaponTypes.includes(itemType)) {
			// off-hand weapon check
			if (!stats.dualWield()) {
				chat.log('You cannot dual wield!', 'chat-warning')
				return false
			}
		}

		if (eqType === 'primary' &&
			item.twoHandWeaponTypes.includes(itemType)) {
			// two-hand constraint checks (no off-hand)
			if (items.eq[13].name) {
				chat.log('You cannot equip a two-hand weapon while dual wielding!', 'chat-warning')
				return false
			}
		}

		console.info('eqDropValid', eqType, itemType)
		if (eqType === 'secondary' &&
			item.twoHandWeaponTypes.includes(items.eq[12].itemType)) {
			chat.log('You cannot equip a shield while wielding a two-hand weapon!', 'chat-warning')
			return false
		}

		// dropping to non-eq slot
		return item.eqSlots[eqType] === void 0 ||
			// dropping to eq slot
			item.eqSlots[eqType].includes(itemType)
	}

	function resetDrop() {
		item.isDragging = false
		item.awaitingDrop = false
		item.dragData = {}
		item.dropData = {}
		item.dragType = ''
		item.dropType = ''
		item.dragSlot = -1
		item.dropSlot = -1
		item.dragEqType = ''
		item.dropEqType = ''
		dom.itemTooltipCursorImg.style.visibility = 'hidden'
		item.isIdentifyMode && toggleIdentifyMode()
	}
	function handleDropFail(r) {
		ng.msg(r.responseText, 8);
		resetDrop()
	}

	function handleDragStart() {
		// prevents drag and drop while waiting for the server to move items
		item.awaitingDrop = true
		var link = createElement('style')
		link.type = 'text/css';
		link.id = 'temp-dnd-link'
		document.head.appendChild(link)
		link.sheet.addRule('.item-slot', 'pointer-events: none; cursor: url("css/cursor/normal.cur"), auto !important')
	}
	function handleDropAlways() {
		// ajax end
		item.awaitingDrop = false
		item.identifyItemMode = false
		item.isContextClick = false;
		$('#temp-dnd-link').remove()
		console.info('handleDropAlways')
	}

	function getDragItemName() {
		return items[item.dragType][item.dragSlot].name
	}

	function dropItem(event) {
		if (!item.dragType) return
		if (!myItemTypes.includes(item.dragType)) {
			ng.msg('You can\'t destroy items that don\'t belong to you!', 4)
			resetDrop()
			return
		}
		//console.info('dropItem', event)
		if (event.ctrlKey || ng.config.fastDestroy) destroy()
		else if (item.dragType && item.dragSlot >= 0) {
			toast.destroyItem({
				accept: 'destroy-item',
				dismiss: '',
				msg: 'Are you sure you want to destroy ' + getDragItemName()
			});
		}
	}
	function processNewItemToInv(obj) {
		console.info('processNewItemToInv', obj)
		items.inv[obj.slot] = {
			...obj.itemData,
			row: obj.row * 1
		}
		bar.updateItemSlotDOM('inv', obj.slot)
	}
	function buy() {
		if (item.goldValue > my.gold) {
			ng.splitText('various-description', 'Sorry, friend! We don\'t offer financing! You\'re gonna need more gold than that!')
			return
		}
		buyItemSlot = item.getFirstAvailableInvSlot()
		if (buyItemSlot === -1) {
			ng.splitText('various-description', 'You have no room in your inventory! Come back when you have room.')
			return
		}
		handleDragStart()
		console.info('item.buy', item.dragData)
		$.post(app.url + 'item/buy-item.php', {
			gold: my.gold - item.goldValue,
			slot: buyItemSlot,
			name: item.dragData.name,
			data: JSON.stringify(_.omit(item.dragData, ['name'])),
		}).done(data => {
			querySelector('#various-description').innerHTML = 'Thank you for buying ' + getItemNameString(item.dragData) + ' for ' + item.goldValue + ' gold!'
			processNewItemToInv({
				slot: buyItemSlot,
				itemData: _.cloneDeep(item.dragData),
				row: data,
			})
			if (item.dragData.cost) {
				bar.updateItemSlotDOM(town.openVariousWindow.toLowerCase(), item.dragSlot)
				resetDrop()
			}
			else {
				items[item.dragType][item.dragSlot] = {}
				bar.updateItemSlotDOM(town.openVariousWindow.toLowerCase(), item.dragSlot)
				resetDrop()
				tooltip.goldValue = 0
			}
			town.setMyGold(my.gold - item.goldValue)
			town.setStoreGold(item.goldValue)
		}).fail(function() {
			items.inv[buyItemSlot] = {}
		}).always(handleDropAlways)
	}
	function sell() {
		if (!item.dragData.row || !item.goldValue) {
			resetDrop()
			return
		}
		console.warn('sell start', item.dragData.row, item.dragType)
		console.info('item.dragType', item.dragType, item.dragSlot)
		handleDragStart()
		$.post(app.url + 'item/sell-item.php', {
			row: item.dragData.row,
			dragType: item.dragType,
			gold: my.gold + item.goldValue
		}).done(handleSellSuccess)
			.fail(handleDropFail)
			.always(handleDropAlways)
	}
	function destroy() {
		if (!item.dragData.row) {
			resetDrop()
			return
		}
		console.warn('destroy start', item.dragData.row, item.dragType)
		handleDragStart()
		$.post(app.url + 'item/destroy-item.php', {
			row: item.dragData.row,
			dragType: item.dragType
		}).done(handleDestroySuccess)
			.fail(handleDropFail)
			.always(handleDropAlways)
	}


	function handleSellSuccess() {
		querySelector('#various-description').innerHTML = 'Thank you for selling ' + getItemNameString(item.dragData) + ' for ' + tooltip.goldValue + ' gold!'
		handleDestroySuccess()
		tooltip.goldValue = 0
		town.setMyGold(my.gold + item.goldValue)
		town.setStoreGold()
	}
	function handleDestroySuccess() {
		items[item.dragType][item.dragSlot] = {}
		bar.updateItemSwapDOM()
		resetDrop()
		tooltip.conditionalHide()
		if (trade.data.name) {
			trade.updateTrade({
				availableSlots: trade.availableInvSlots(),
			})
		}
	}
	function handleItemSlotContextClick(event) {
		if (item.awaitingDrop || item.isDragging) return false
		var {index, type} = _.pick(event.currentTarget.dataset, [
			'index', 'type'
		])
		if (items[type][index].use) {
			useItem(type, index)
		}
		else {
			resetDrop()
			item.isContextClick = true
			toggleDrag(event)
			if (item.dragData.name) {
				console.info(item.dragData, item.dragType, item.dragSlot)
				toggleDrag({
					currentTarget: {
						dataset: {
							index: getEqIndexByType(item.dragData),
							type: 'eq',
							eqType: equipmentEqTypeIndex[item.dragData.itemType]
						}
					}
				})
			}
		}
		return false // context disabled
	}
	function useItem(type, index) {
		warn('useItem', index, type, items[type][index])
		item.dropData = {}
		if (items[type][index].name) {
			item.dragData = items[type][index]
			item.dragSlot = index
			item.dragType = type

			console.info('dragData', item.dragData)
			if (item.dragData.itemType === 'potion') {
				handleDragStart()
				$.post(app.url + 'item/destroy-item.php', {
					row: items[type][index].row,
					dragType: type
				}).done(handleUseSuccess)
					.fail(handleDropFail)
					.always(handleDropAlways)
			}
			else if (item.dragData.name === 'Identification Scroll') {
				toggleIdentifyMode(index, type)
			}
		}
	}
	function toggleIdentifyMode(index, type) {
		if (item.isIdentifyMode) {
			item.isIdentifyMode = false
			$('#temp-identify-item').remove()
		}
		else {
			item.isIdentifyMode = true
			item.identifyScrollIndex = index * 1
			item.identifyScrollType = type
			var link = createElement('style')
			link.type = 'text/css';
			link.id = 'temp-identify-item'
			document.head.appendChild(link)
			link.sheet.addRule('.item-slot', 'cursor: url("css/cursor/gear.cur"), auto !important')
		}
	}
	function preIdentifyItem() {
		warn('preIdentifyItem', item.dragType, item.dragSlot, item.dragData)
		if (!item.dragData.row) {
			resetDrop()
			return
		}
		if (typeof item.dragData.unidentified === 'undefined' ||
			item.dragData.unidentified === false) {
			chat.log('That item\'s properties are already known.', 'chat-warning')
			resetDrop()
			return
		}
		if (!myItemTypes.includes(item.dragType)) {
			ng.msg('You can\'t identify items that don\'t belong to you!', 4)
			resetDrop()
			return
		}
		var index = items.inv.findIndex(slot => slot.name === 'Identification Scroll')
		if (index === -1) {
			chat.log('You must have an Identification Scroll in your inventory.', 'chat-warning')
			resetDrop()
			return
		}
		identifyItem(index, 'inv', item.dragSlot, item.dragType)
	}
	function identifyItem(scrollIndex, scrollType, itemSlot, itemType) {
		if (typeof itemSlot === 'undefined') {
			itemSlot = getFirstUnidentifiedItemSlot()
		}
		warn('identify item!', itemSlot)
		if (itemSlot === -1) {
			chat.log('You have no items that need to be identified.', 'chat-warning')
			resetDrop()
			return
		}
		var newItem = _.cloneDeep(items.inv[itemSlot])
		newItem.unidentified = false

		if (items[itemType][itemSlot].row &&
			items[scrollType][scrollIndex].row) {
			ng.lock(true)
			$.post(app.url + 'item/update-item-data.php', {
				itemRow: items[itemType][itemSlot].row,
				data: JSON.stringify(_.omit(newItem, ['name'])),
				scrollRow: items[scrollType][scrollIndex].row,
			}).done(resp => {
				console.info('okokokok', resp)
				items[scrollType][scrollIndex] = {}
				items[itemType][itemSlot].unidentified = false
				bar.updateItemSlotDOM(scrollType, scrollIndex)
				resetDrop()
				chat.log('You successfully identified: ' + getItemNameString(items[itemType][itemSlot]))
				tooltip.hide()
				setTimeout(() => {
					tooltip.show(items[itemType][itemSlot], querySelector('#' + itemType + '-slot-img-' + itemSlot), itemType)
				}, 100)
			}).always(ng.unlock)
		}
		else console.error('no row data found')
	}

	function handleUseSuccess() {
		console.info('handleUseSuccess', item.dragData.itemType)
		if (item.dragData.itemType === 'potion') {
			expendPotion(item.dragData.itemSubType, item.dragData.imgIndex)
		}
		handleDestroySuccess()
	}
	function expendPotion(type, index) {
		// type and potion size
		var obj = { value: 0 }
		var lastValue = 0
		var diff = 0
		TweenMax.to(obj, 6, {
			value: potionRecoveryByJob(type, index),
			ease: SteppedEase.config(60),
			onUpdate: parseDifference,
		})
		/////////////////////
		function parseDifference() {
			diff = obj.value - lastValue
			lastValue = obj.value
			addResource(type, diff)
		}
	}
	function addResource(type, amount) {
		if (my.hp > 0 && amount > 0) {
			my[type] += amount
			if (my[type] > my[type + 'Max']) my[type] = my[type + 'Max']
			bar.updateBar(type)
		}
	}
	function getEqIndexByType(drag) {
		var eqIndex = equipmentSlotIndex[drag.itemType]
		if (eqIndex === 2 &&
			items.eq[2].name &&
			!items.eq[3].name) {
			eqIndex = 3
		}
		console.info('getEqIndexByType eqIndex', eqIndex)
		return eqIndex
	}
	function getItemValueHtml(item, isSelling) {
		tooltip.goldValue = getItemValue(item, isSelling)
		return '<div style="color: gold; margin: .2rem">'+ (isSelling ? 'Sell Value: ' : 'Cost: ') + tooltip.goldValue + '</div>'
	}
	function getItemValue(item, selling) {
		value = 1
		if (!item.cost) {
			for (key in item) {
				if (typeof item[key] === 'number' &&
					typeof saleValues[key] === 'number') {
					var val = item[key] * (saleValues[key] * (selling ? 1 : 16))
					value += val
				}
			}
		}
		else {
			if (selling) {
				value = item.cost * .2
			}
			else {
				value = item.cost
			}
		}
		if (!selling) {
			// conditional purchase increases by itemType
			if (item.itemType === 'rings' ||
				item.itemType === 'amulets' ||
				item.itemType === 'focus' ||
				item.itemType === 'shields' ||
				item.itemType === 'charms') {
				value *= 1.5
			}
			else if (item.itemType === 'staves' ||
				item.itemType === 'piercers' ||
				item.itemType === 'bows' ||
				item.itemType === 'oneHandSlash' ||
				item.itemType === 'twoHandSlash' ||
				item.itemType === 'oneHandBlunt' ||
				item.itemType === 'twoHandBlunt') {
				value *= 2.3
			}
		}
		return ~~value
	}
	function getPotion(index, type) {
		return potions[type][index]
	}
	function getIdentifyScroll() {
		return _.clone(identifyScroll)
	}
})(_, Object, JSON, $, SteppedEase, TweenMax);