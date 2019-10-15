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
	var prefixNames = {
		resistBlood: function(val) {
			if (val <= 10) { return 'Feldspar' }
			else if (val <= 20) { return 'Bastnasite' }
			else if (val <= 30) { return 'Carnelian' }
			else { return 'Rhodonite' }
		},
		resistPoison: function(val) {
			if (val <= 10) { return 'Beryl' }
			else if (val <= 20) { return 'Viridian' }
			else if (val <= 30) { return 'Jade' }
			else { return 'Emerald' }
		},
		resistArcane: function(val) {
			if (val <= 10) { return 'Quartz' }
			else if (val <= 20) { return 'Opal' }
			else if (val <= 30) { return 'Beryl' }
			else { return 'Sphene' }
		},
		resistLightning: function(val) {
			if (val <= 10) { return 'Tangerine' }
			else if (val <= 20) { return 'Ocher' }
			else if (val <= 30) { return 'Coral' }
			else { return 'Amber' }
		},
		resistFire: function(val) {
			if (val <= 10) { return 'Crimson' }
			else if (val <= 20) { return 'Russet' }
			else if (val <= 30) { return 'Garnet' }
			else { return 'Ruby' }
		},
		resistIce: function(val) {
			if (val <= 10) { return 'Azure' }
			else if (val <= 20) { return 'Lapis' }
			else if (val <= 30) { return 'Cobalt' }
			else { return 'Sapphire' }
		},
		resistAll: function(val) {
			if (val <= 7) { return 'Shimmering' }
			else if (val <= 11) { return 'Rainbow' }
			else if (val <= 15) { return 'Scintillating' }
			else if (val <= 20) { return 'Prismatic' }
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
		},/*
		attack: function(val) {
			if (val <= 20) { return 'Bronze' }
			else if (val <= 40) { return 'Iron' }
			else if (val <= 60) { return 'Steel' }
			else if (val <= 80) { return 'Silver' }
			else { return 'Gold' }
		},
		offense: function(val) {
			if (val <= 1) { return 'Bishop\'s' }
			else if (val <= 2) { return 'Knight\'s' }
			else { return 'Queen\'s' }
		},
		defense: function(val) {
			if (val <= 1) { return 'Pawn\'s' }
			else if (val <= 2) { return 'Rook\'s' }
			else { return 'King\'s' }
		},
		oneHandSlash: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else if (val <= 2) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		oneHandBlunt: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else if (val <= 2) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		piercing: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else if (val <= 2) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		archery: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else if (val <= 2) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		handToHand: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else if (val <= 2) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		twoHandSlash: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else if (val <= 2) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		twoHandBlunt: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else if (val <= 2) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		dodge: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else if (val <= 2) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		parry: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else if (val <= 2) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		riposte: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else if (val <= 2) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		alteration: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else if (val <= 2) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		conjuration: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else if (val <= 2) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		evocation: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else if (val <= 2) { return 'Swordsman\'s' }
			else { return 'Gladiator\'s' }
		},
		allSkills: function(val) {
			if (val <= 1) { return 'Fencer\'s' }
			else { return 'Gladiator\'s' }
		},*/
	}
	var suffixNames = {
		strength: function(val) {
			if (val <= 2) { return 'of Strength' }
			else if (val <= 5) { return 'of Might' }
			else if (val <= 9) { return 'of the Ox' }
			else if (val <= 15) { return 'of the Giants' }
			else if (val <= 20) { return 'of the Titans' }
			else { return 'of Atlas' }
		},
		stamina: function(val) {
			if (val <= 2) { return 'of Stamina' }
			else if (val <= 5) { return 'of Vitality' }
			else if (val <= 9) { return 'of Zest' }
			else if (val <= 15) { return 'of Vim' }
			else if (val <= 20) { return 'of Vigor' }
			else { return 'of Life' }
		},
		agility: function(val) {
			if (val <= 2) { return 'of Agility' }
			else if (val <= 5) { return 'of Quickness' }
			else if (val <= 9) { return 'of Swiftness' }
			else if (val <= 15) { return 'of Alacrity' }
			else if (val <= 20) { return 'of Celerity' }
			else { return 'of Speed' }
		},
		dexterity: function(val) {
			if (val <= 2) { return 'of Dexterity' }
			else if (val <= 5) { return 'of Skill' }
			else if (val <= 9) { return 'of Accuracy' }
			else if (val <= 15) { return 'of Precision' }
			else if (val <= 20) { return 'of Perfection' }
			else { return 'of Nirvana' }
		},
		wisdom: function(val) {
			if (val <= 2) { return 'of Wisdom' }
			else if (val <= 5) { return 'of Savvy' }
			else if (val <= 9) { return 'of Foresight' }
			else if (val <= 15) { return 'of Intuition' }
			else if (val <= 20) { return 'of Judgment' }
			else { return 'of Acumen' }
		},
		intelligence: function(val) {
			if (val <= 2) { return 'of Intelligence' }
			else if (val <= 5) { return 'of the Mind' }
			else if (val <= 9) { return 'of Brilliance' }
			else if (val <= 15) { return 'of Sorcery' }
			else if (val <= 20) { return 'of Wizardry' }
			else { return 'of Enlightenment' }
		},
		charisma: function(val) {
			if (val <= 2) { return 'of Charisma' }
			else if (val <= 5) { return 'of Allure' }
			else if (val <= 9) { return 'of Glamour' }
			else if (val <= 15) { return 'of Magnetism' }
			else if (val <= 20) { return 'of Temptation' }
			else { return 'of Persuasion' }
		},
		allStats: function(val) {
			if (val <= 3) { return 'of the Sky' }
			else if (val <= 7) { return 'of the Moon' }
			else if (val <= 11) { return 'of the Stars' }
			else if (val <= 15) { return 'of the Heavens' }
			else { return 'of the Firmament' }
		},
		hp: function(val) {
			if (val <= 10) { return 'Feldspar' }
			else if (val <= 20) { return 'Bastnasite' }
			else if (val <= 30) { return 'Carnelian' }
			else { return 'Rhodonite' }
		},
		mp: function(val) {
			if (val <= 10) { return 'Feldspar' }
			else if (val <= 20) { return 'Bastnasite' }
			else if (val <= 30) { return 'Carnelian' }
			else { return 'Rhodonite' }
		},
		sp: function(val) {
			if (val <= 10) { return 'Feldspar' }
			else if (val <= 20) { return 'Bastnasite' }
			else if (val <= 30) { return 'Carnelian' }
			else { return 'Rhodonite' }
		},
		crit: function(val) {
			if (val <= 10) { return 'Feldspar' }
			else if (val <= 20) { return 'Bastnasite' }
			else if (val <= 30) { return 'Carnelian' }
			else { return 'Rhodonite' }
		},
		leech: function(val) {
			if (val <= 10) { return 'Feldspar' }
			else if (val <= 20) { return 'Bastnasite' }
			else if (val <= 30) { return 'Carnelian' }
			else { return 'Rhodonite' }
		},
		wraith: function(val) {
			if (val <= 10) { return 'Feldspar' }
			else if (val <= 20) { return 'Bastnasite' }
			else if (val <= 30) { return 'Carnelian' }
			else { return 'Rhodonite' }
		},
		haste: function(val) {
			if (val <= 10) { return 'Feldspar' }
			else if (val <= 20) { return 'Bastnasite' }
			else if (val <= 30) { return 'Carnelian' }
			else { return 'Rhodonite' }
		},/*
		addBlood: function(val) {

		},
		addPoison: function(val) {

		},
		addArcane: function(val) {

		},
		addLightning: function(val) {

		},
		addFire: function(val) {

		},
		addIce: function(val) {

		},*/
		increaseBlock: function(val) {
			if (val <= 10) { return 'Feldspar' }
			else if (val <= 20) { return 'Bastnasite' }
			else if (val <= 30) { return 'Carnelian' }
			else { return 'Rhodonite' }
		},
	}
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
		console.info('itemObj', rarity, itemObj)

		// get item-filtered base item
		var filteredItems = _.filter(itemObj['normal'], filterItems)
		var filteredItemsLen = filteredItems.length
		// pick one of the items from the array
		var filteredItemsIndex = _.random(0, filteredItemsLen - 1)
		var drop = _.assign(
			itemObj.base,
			filteredItems[filteredItemsIndex]
		)
		console.info('drop', _.cloneDeep(drop))
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
		if (rarity === 'magic') {
			console.info('this is magic yo')
			console.info('itemObj', itemObj)
			processMagicDrop(drop)
		}
		return drop;
		////////////////////////////////////////////////////
		function processMagicDrop(drop) {
			console.info('drop type??', drop)
			itemObj.prefix = convertProps(itemObj.prefix)
			itemObj.suffix = convertProps(itemObj.suffix)
			var prefixKeys = _.keys(itemObj.prefix)
			var suffixKeys = _.keys(itemObj.suffix)
			var prefixLen = prefixKeys.length
			var suffixLen = suffixKeys.length
			// get prefix and suffix
			var prefix = prefixKeys[_.random(0, prefixLen - 1)]
			var suffix = suffixKeys[_.random(0, suffixLen - 1)]
			// get values
			var prefixVal = _.random(1, itemObj.prefix[prefix])
			var suffixVal = _.random(1, itemObj.suffix[suffix])
			// get name prefix and suffix
			var prefixName = prefixNames[prefix](val)
			var suffixName = suffixNames[suffix](val)
			getMagicSuffixName(prefix, prefixVal)

			console.warn(prefix, prefixVal)
			console.warn(suffix, suffixVal)
			console.warn('mobLevel', config)

			// getPrefixBySlot(drop);
			drop.str = _.random(1, 15)
			drop.resistIce = _.random(1, 15)
			drop.name = [
				'Boreal',
				drop.name,
				'of the Titans'
			].join(' ')
			return drop
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
	function convertProps(props) {
		var prop, val;
		for (prop in props) {
			val = props[prop]
			console.info('processProp', prop, val)
			if (prop === 'resists') {
				props.resistBlood = val
				props.resistPoison = val
				props.resistArcane = val
				props.resistLightning = val
				props.resistFire = val
				props.resistIce = val
				delete props.resists
			}
			else if (prop === 'skills') {
				props.offense = val
				props.defense = val
				props.oneHandSlash = val
				props.oneHandBlunt = val
				props.piercing = val
				props.archery = val
				props.handToHand = val
				props.twoHandSlash = val
				props.twoHandBlunt = val
				props.dodge = val
				props.parry = val
				props.riposte = val
				props.alteration = val
				props.conjuration = val
				props.evocation = val
				delete props.skills;
			}
			else if (prop === 'stats') {
				props.str = val
				props.sta = val
				props.agi = val
				props.dex = val
				props.wis = val
				props.intel = val
				props.cha = val
				delete props.stats
			}
			else if (prop === 'points') {
				props.hp = val
				props.mp = val
				props.sp = val
				delete props.points
			}
			else if (prop === 'regen') {
				props.hpRegen = val
				props.mpRegen = val
				props.spRegen = val
				delete props.regen
			}
			else if (prop === 'addDamage') {
				props.addBlood = val
				props.addPoison = val
				props.addArcane = val
				props.addLightning = val
				props.addFire = val
				props.addIce = val
				delete props.addDamage
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