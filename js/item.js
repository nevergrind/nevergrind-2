var item;
var loot = {};
!function() {
	item = {
		MAX_EQUIPMENT: 15,
		MAX_INVENTORY: 16,
		MAX_MERCHANT: 18,
		MAX_BLACKSMITH: 18,
		MAX_APOTHECARY: 18,
		MAX_TAVERN: 30,
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
			primary: ['oneHandBlunts', 'oneHandSlashers', 'piercers', 'focus', 'twoHandBlunts', 'twoHandSlashers', 'staves', 'bows', void 0],
			secondary: ['oneHandBlunts', 'oneHandSlashers', 'piercers', 'focus', 'shields', void 0],
			charms: ['charms', void 0],
		},
		allWeaponTypes: ['oneHandBlunts', 'oneHandSlashers', 'piercers', 'focus', 'twoHandBlunts', 'twoHandSlashers', 'staves', 'bows'],
		offhandWeaponTypes: ['oneHandBlunts', 'oneHandSlashers', 'piercers', 'focus'],
		twoHandWeaponTypes: ['twoHandBlunts', 'twoHandSlashers', 'staves', 'bows'],
		getEquipString,
		getRarity,
		getItem,
		getLoot,
		dropReset,
		toggleDrag,
		updateCursorImgPosition,
		dropItem,
		destroy,
		handleItemSlotContextClick,
	}
	const slotRequiresMagic = [
		'rings',
		'amulets',
		'charms',
	]
	const itemsWithDurability = [
		'helms',
		'shoulders',
		'chests',
		'bracers',
		'gloves',
		'belts',
		'legs',
		'boots',
		'oneHandSlashers',
		'twoHandSlashers',
		'oneHandBlunts',
		'twoHandBlunts',
		'piercers',
		'focus',
		'staves',
		'bows',
		'shields'
	]
	const myItemTypes = ['eq', 'inv', 'bank']
	const equipmentSlotIndex = {
		'amulets': 1,
		'belts': 9,
		'boots': 11,
		'bows': 12,
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
		'bows': 'primary',
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
		increaseBlock: 2,
		resistFrozen: 2,
		resistFear: 2,
		resistStun: 2,
		resistSilence: 2,
	}
	var twoHandItemTypes = [
		'twoHandSlashers',
		'twoHandBlunts',
		'staves',
		'bows',
	]
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
	////////////////////////////////////////////
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
	function getItemNameString(drop) {
		return '<span class="item-'+ drop.rarity +'">[' + drop.name + ']</span>'
	}
	function getFirstAvailableInvSlot() {
		var index = items.inv.findIndex(slot => !slot.name)
		if (index > -1) items.inv[index].name = 'Loading'
		return index
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
			data: JSON.stringify(drop),
		}).done(data => {
			items.inv[slot] = drop
			items.inv[slot].row = data * 1
			var mobName = _.get(mob[mobSlot], 'name', 'You discovered an item: ')
			chat.log(mobName + getItemNameString(drop))
			console.warn('item dropped:', data)
			bar.updateInventorySlotDOM('inv', slot)
		}).fail(function() {
			items.inv[slot] = {}
		}).always(handleDropAlways)
	}
	function getItem(config) {
		/**
		 * mobLevel: int = 1-max sets max possible item level
		 * bonus: int = provides a boost to finding great items 10 is high
		 * rarity: string = forces a rarity type
		 * itemSlot: forces a particular item slot
		 * itemName: forces specific sub item based on base name
		 */
		if (!config) config = { mobLevel: 1 }
		if (config.bonus === undefined) {
			config.bonus = 0
		}
		var rarity = config.rarity || getRarity(config.bonus)
		// set item type (normal, magic, etc)
		//console.info('getRarity', rarity)
		var keys = Object.keys(loot)
		// get possible slotTypes (helms, chests) based on rarity
		var filteredKeys = _.filter(keys, filterKeys)
		//console.info('filteredKeys', filteredKeys)

		if (config.itemSlot && filteredKeys.includes(config.itemSlot)) {
			var itemSlot = config.itemSlot
		}
		else {
			// pick one of the possible slotTypes
			var itemSlot = filteredKeys[_.random(0, filteredKeys.length - 1)]
		}
		// clone item and then figure out what to grab
		var itemObj = _.cloneDeep(loot[itemSlot])
		//console.info('itemObj', rarity, itemObj)

		// get base items filtered by mob level
		var filteredItems = _.filter(itemObj['normal'], filterItems)
		var filteredItemsLen = filteredItems.length

		// pick one of the items from the array
		if (config.itemName) {
			// specific item
			var filteredItemsIndex = _.findIndex(filteredItems, item => item.name === config.itemName)
			//console.warn('filteredItemsIndex', filteredItemsIndex)
		}
		else {
			// random item of type
			var filteredItemsIndex = _.random(0, filteredItemsLen - 1)
		}
		// combine itemSlot base props with base item
		var drop = _.assign(
			itemObj.base,
			filteredItems[filteredItemsIndex]
		)
		drop.imgIndex = getItemImageIcon(itemSlot, filteredItemsIndex, drop.imgIndex)
		drop.baseName = drop.name

		// check defense range
		if (drop.minArmor) {
			drop.armor = _.random(drop.minArmor, drop.maxArmor)
			delete drop.minArmor
			delete drop.maxArmor
		}
		drop.rarity = rarity
		if (itemsWithDurability.includes(itemSlot)) {
			drop.durability = 100
		}
		drop.itemType = itemSlot
		// magic
		if (rarity === 'unique') {
			var len = getUniqueItemCount(drop);
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
			var prefixKeys = Object.keys(itemObj.prefix)
			var suffixKeys = Object.keys(itemObj.suffix)

			console.info('rarity', rarity)
			if (rarity === 'magic') {
				processMagicDrop(drop)
			}
			else if (rarity === 'rare') {
				processRareDrop(drop)
			}
			// post-process item
		}
		postProcessDrop(drop)
		return drop;
		////////////////////////////////////////////////////
		function getItemImageIcon(itemType, index, imgIndex) {
			if (itemType === 'amulets') index = _.random(0, 4)
			else if (itemType === 'rings') index = _.random(0, 3)
			else if (itemType === 'charms') index = _.random(0, 2)
			else if (itemType === 'belts' || itemType === 'boots') index = ~~(index / 2)
			else if (itemType === 'bows') index = imgIndex
			//console.info('index', itemType, index)
			return index;
		}
		function getUniqueItemCount(drop) {
			if (_.isArray(loot[drop.itemType].unique)) {
				var uniqueItems = _.filter(loot[drop.itemType].unique, item => item.name === drop.name);
				return uniqueItems.length
			}
			else return 0
		}
		function processUniqueProps(uniqueItem, drop) {
			// remove old
			uniqueItem.name = uniqueItem.newName
			delete uniqueItem.newName
			delete uniqueItem.odds
			// add props
			for (var key in uniqueItem) {
				if (_.isArray(uniqueItem[key])) {
					drop[key] = _.random(uniqueItem[key][0], uniqueItem[key][1])
				}
				else drop[key] = uniqueItem[key]
			}
		}
		function processUniqueDrop(drop) {
			// select one if more than one exists
			var possibleItems = _.filter(loot[drop.itemType].unique, item => item.name === drop.name)
			var len = possibleItems.length
			// console.info('possibleItems', possibleItems)
			if (len > 1) {
				var itemIndexArray = []
				possibleItems.forEach(function(item, index) {
					// default to equal chance dropping for all unique items in this item type
					item.odds = item.odds || 100
					// console.info('odds', item.odds)
					for (var i = 0; i < item.odds; i++) {
						itemIndexArray.push(index)
					}
				})

				var itemRoll = _.random(0, itemIndexArray.length - 1)
				var itemIndex = itemIndexArray[itemRoll]
				var uniqueItem = _.cloneDeep(possibleItems[itemIndex])
			}
			else {
				var uniqueItem = _.cloneDeep(possibleItems[0])
			}

			processUniqueProps(uniqueItem, drop)

			//console.warn('uniqueItem drop', drop)
		}
		function processRareDrop(drop) {
			var rareKeys = _.uniq(_.concat(
				prefixKeys,
				suffixKeys,
				Object.keys(itemObj.rare)
			))
			var numberOfProps = _.random(3, 6)
			// console.info('rare drop', drop, config)
			// get prefix and suffix
			var props = []
			var tc = getTreasureClass(config.mobLevel)
			for (var i=0; i<numberOfProps; i++) {
				props[i] = getRareProp()
			}
			// console.warn('props', props)

			function getRareProp() {
				var key = rareKeys[_.random(0, rareKeys.length - 1)]
				var propType = getPropType(key)
				var val = _.random(minValue[key], setMaxPropValue(itemObj[propType], key, tc))
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

			// assign property values
			props.forEach(function(prop) {
				drop[prop.key] = prop.val
			})
			drop.name = getRareName(drop.itemType, drop.name)
		}
		function processMagicDrop(drop) {
			/*console.info('magic drop', drop, config)
			console.info('prefixKeys', prefixKeys)
			console.info('suffixKeys', suffixKeys)*/
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
			//console.info('itemObj', itemObj)
			var tc = getTreasureClass(config.mobLevel)
			// set prefix and bound check
			var prefixMax = setMaxPropValue(itemObj.prefix, prefix, tc)
			// set suffix and bound check
			var suffixMax = setMaxPropValue(itemObj.suffix, suffix, tc)
			/*console.info('infos', config.mobLevel, tc, prefix, prefixMax, suffix, suffixMax)
			console.warn('max ', prefixMax, suffixMax)*/

			var getPrefixSuffixComboType = _.random(1, 100)
			console.info('prefix', prefix)
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
		function preProcessDrop() {
			// set possible prefixes, suffixes, rare arrays and remove weapon specific props
			itemObj.prefix = convertProps(itemObj.prefix)
			itemObj.suffix = convertProps(itemObj.suffix)
			itemObj.rare = convertProps(itemObj.rare)
		}
		function postProcessDrop(drop) {
			// some props require further processing
			if (drop.haste) {
				var newSpeed = (drop.speed - (drop.speed * (drop.haste / 100))).toFixed(1)
				console.warn('new speed:', drop.speed, newSpeed)
				drop.speed = newSpeed * 1
			}
			if (drop.enhancedArmor) {
				var newArmor = (drop.armor + (drop.armor * (drop.enhancedArmor / 100))).toFixed(1)
				drop.armor = _.round(newArmor * 1)
			}
			if (drop.enhancedDamage) {
				var newMinDamage = (drop.minDamage + (drop.minDamage * (drop.enhancedDamage / 100))).toFixed(1) * 1
				var newMaxDamage = (drop.maxDamage + (drop.maxDamage * (drop.enhancedDamage / 100))).toFixed(1) * 1
				drop.minDamage = _.round(newMinDamage)
				drop.maxDamage = _.round(newMaxDamage)
			}
		}

		function deleteWeaponSpecificProps(itemType) {
			//console.warn('deleteWeaponSpecificProps', itemType, itemObj.prefix)
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
			if (rarity === 'normal') {
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
	function stripRareKeys(rareKeys, key) {
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
		console.info('set max', obj)
		console.info('setMaxPropValue', obj[key], key, tc)
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
		if (item.awaitingDrop) return
		var index = event.currentTarget.dataset.index * 1
		var type = event.currentTarget.dataset.type

		console.info('toggleDrag', type, index)
		if (item.isDragging) {
			if (!myItemTypes.includes(item.dragType)) {
				console.warn('isDragging a ', item.dragType)
				ng.msg('You must purchase that item before putting it in your inventory!', 4)
				dropReset()
				return
			}

			item.dropEqType = event.currentTarget.dataset.eqType
			// check for same item
			if (item.dragSlot === index && item.dragType === type) {
				dropReset()
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
				dropReset()
				return
			}

			handleDragStart()
			toast.hideDestroyToast()
			if (!item.dropData.name) {
				var index = item.lastEvent.currentTarget.dataset.index
				console.info('lastEvent', index)
				item.lastEvent = event
				//item.lastEvent.currentTarget.dataset.index = index
			}
			if (item.dropData.name) {
				// swap
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
			else {
				// update
				if (myItemTypes.includes(item.dropType)) {
					$.post(app.url + 'item/update-item.php', {
						dragRow: item.dragData.row,
						dragSlot: item.dropSlot,
						dragType: item.dropType,
						dropType: item.dragType,
					}).done(handleDropSuccess)
						.fail(handleDropFail)
						.always(handleDropAlways)
				}
				else {
					console.warn('Item type ', item.dropType, ' is client side only. Skipping update-item.php')
				}
			}
		}
		else {
			item.lastEvent = event
			tooltip.handleItemLeave(event)
			item.dragEqType = event.currentTarget.dataset.eqType
			console.info('//// dragEQ dragEqType', event.currentTarget.dataset)
			// drag
			item.dropData = {}
			if (items[type][index].name) {
				item.dragData = items[type][index]
				item.dragSlot = index
				item.dragType = type
				showCursorImg(type, index)
			}
			console.warn("drag row data: ", type, index, item.dragData.row)
			if (item.dragData.name) item.isDragging = true
			else dropReset()
		}
	}

	function showCursorImg(type, index) {
		updateCursorImgPosition()
		dom.itemTooltipCursorImg.style.visibility = 'visible'
		dom.itemTooltipCursorImg.src = bar.getItemSlotImage(type, index)
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
		console.warn('///////////////////////////////////////////////')

		if (item.dragType !== 'eq' && item.dropType !== 'eq') {
			resp = true
			console.info('no equipment items - all good!')
		}
		else {
			console.warn('drag 1 itemType', drag.itemType, 'to slot', item.dropEqType)
			console.warn('drag 2 itemType', drop.itemType, 'to slot', item.dragEqType)

			if (eqDropValid(drag.itemType, item.dropEqType, drag.itemLevel) &&
				eqDropValid(drop.itemType, item.dragEqType, drop.itemLevel)) {
				resp = true
			}
		}

		return resp;
	}

	function eqDropValid(itemType, eqType, itemLevel) {
		if (my.level < itemLevel) {
			chat.log('Your level is not high enough to equip this item!', 'chat-warning')
			return false
		}
		// weapon checks
		if (eqType === 'primary' || eqType === 'secondary' &&
			item.allWeaponTypes.includes(itemType)) {
			// check character can equip a weapon
			if (itemType === 'oneHandSlashers' && !stat.oneHandSlash() ||
				itemType === 'oneHandBlunts' && !stat.oneHandBlunt() ||
				itemType === 'twoHandSlashers' && !stat.twoHandSlash() ||
				itemType === 'twoHandBlunts' && !stat.twoHandBlunt() ||
				itemType === 'piercing' && !stat.piercing() ||
				itemType === 'bows' && !stat.archery()) {
				chat.log('You cannot equip this type of weapon!', 'chat-warning')
				return false
			}
		}

		if (eqType === 'secondary' &&
			item.offhandWeaponTypes.includes(itemType)) {
			// off-hand weapon check
			if (!stat.dualWield()) {
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

	function dropReset() {
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
	}
	function handleDropFail(r) {
		ng.msg(r.responseText, 8);
		dropReset()
	}
	function handleDropSuccess() {
		items[item.dropType][item.dropSlot] = item.dragData
		items[item.dragType][item.dragSlot] = item.dropData
		bar.updateDOM()
		dropReset()
		tooltip.handleItemEnter(item.lastEvent)
	}

	function handleDragStart() {
		// ajax start
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
		$('#temp-dnd-link').remove()
		item.isContextClick = false;
		console.info('handleDropAlways')
	}

	function getDragItemName() {
		return items[item.dragType][item.dragSlot].name
	}

	function dropItem(event) {
		if (!item.dragType) return
		if (!myItemTypes.includes(item.dragType)) {
			ng.msg('You can\'t destroy items that don\'t belong to you!', 4)
			dropReset()
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
	function destroy() {
		if (!item.dragData.row) {
			dropReset()
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

	function handleDestroySuccess() {
		items[item.dragType][item.dragSlot] = {}
		bar.updateDOM()
		dropReset()
	}
	function handleItemSlotContextClick(event) {
		if (item.awaitingDrop || item.isDragging) return false
		var {index, type} = _.pick(event.currentTarget.dataset, [
			'index', 'type'
		])
		console.info(index, type)
		item.isContextClick = true
		dropReset()
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

		return false // context disabled
	}
	function getEqIndexByType(drag) {
		console.info('getEqIndexByType', drag.itemType)
		var eqIndex = equipmentSlotIndex[drag.itemType]
		if (eqIndex === 2 &&
			items.eq[2].name &&
			!items.eq[3].name) {
			eqIndex = 3
		}
		return eqIndex
	}
}()