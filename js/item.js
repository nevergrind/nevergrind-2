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
	var itemsWithDurability = [
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
	function getItem(config) {
		/*var rarityTypes = [
			'normal',
			'magic',
			'rare',
			'set',
			'unique',
			'runic',
			'legendary',
		]*/
		// set item type (normal, magic, etc)
		var rarity = config.rarity
		var keys = _.keys(items)
		// get possible slotTypes (helms, chests) based on rarity
		var filteredKeys = _.filter(keys, filterKeys)
		//console.info('filteredKeys', filteredKeys)

		if (config.itemSlot && filteredKeys.includes(config.itemSlot)) {
			var itemSlot = config.itemSlot
		}
		else {
			// pick one of the possible slotTypes for this rarity
			var itemSlot = filteredKeys[_.random(0, filteredKeys.length - 1)]
		}
		var itemObj = _.cloneDeep(items[itemSlot])
		//console.info('itemObj', config.rarity, itemObj)

		// get base items filtered by mob level
		var filteredItems = _.filter(itemObj['normal'], filterItems)
		var filteredItemsLen = filteredItems.length

		// pick one of the items from the array
		if (config.itemName) {
			var filteredItemsIndex = _.findIndex(filteredItems, item => item.name === config.itemName)
			//console.warn('filteredItemsIndex', filteredItemsIndex)
		}
		else {
			var filteredItemsIndex = _.random(0, filteredItemsLen - 1)
		}
		// combine itemSlot base props with base item
		var drop = _.assign(
			itemObj.base,
			filteredItems[filteredItemsIndex]
		)

		// check defense range
		if (drop.minArmor) {
			drop.armor = _.random(drop.minArmor, drop.maxArmor)
			delete drop.minArmor
			delete drop.maxArmor
		}
		drop.rarity = config.rarity
		if (itemsWithDurability.includes(itemSlot)) {
			drop.durability = 100
		}
		drop.itemType = itemSlot
		// magic
		if (rarity === 'unique') {
			var len = getUniqueItemCount(drop);
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
			var prefixKeys = _.keys(itemObj.prefix)
			var suffixKeys = _.keys(itemObj.suffix)

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
		function getUniqueItemCount(drop) {
			if (_.isArray(items[drop.itemType].unique)) {
				var uniqueItems = _.filter(items[drop.itemType].unique, item => item.name === drop.name);
				return uniqueItems.length
			}
			else {
				return 0
			}
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
				else {
					drop[key] = uniqueItem[key]
				}
			}
		}
		function processUniqueDrop(drop) {
			// select one if more than one exists
			var possibleItems = _.filter(items[drop.itemType].unique, item => item.name === drop.name)
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
				_.keys(itemObj.rare)
			))
			var numberOfProps = _.random(3, 6)
			console.info('rare drop', drop, config)
			// get prefix and suffix
			var props = []
			var tc = getTreasureClass(config.mobLevel)
			for (var i=0; i<numberOfProps; i++) {
				props[i] = getRareProp()
			}
			console.warn('props', props)

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
				if (_.get(itemObj.prefix, prop)) {
					return 'prefix'
				}
				else if (_.get(itemObj.suffix, prop)) {
					return 'suffix'
				}
				else {
					return 'rare'
				}
			}

			// assign property values
			props.forEach(function(prop) {
				drop[prop.key] = prop.val
			})
			drop.name = getRareName(drop.itemType, drop.name)
		}
		function processMagicDrop(drop) {
			console.info('magic drop', drop, config)
			console.info('prefixKeys', prefixKeys)
			console.info('suffixKeys', suffixKeys)
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
		function preProcessDrop(drop) {
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
		if (key === 'resistBlood') {
			_.pull(rareKeys, 'resistPoison', 'resistAll')
		}
		if (key === 'resistPoison') {
			_.pull(rareKeys, 'resistBlood', 'resistAll')
		}
		if (key === 'resistArcane') {
			_.pull(rareKeys, 'resistLightning', 'resistAll')
		}
		if (key === 'resistLightning') {
			_.pull(rareKeys, 'resistArcane', 'resistAll')
		}
		if (key === 'resistFire') {
			_.pull(rareKeys, 'resistIce', 'resistAll')
		}
		if (key === 'resistIce') {
			_.pull(rareKeys, 'resistFire', 'resistAll')
		}
		if (key === 'resistAll') {
			_.pull(rareKeys, 'resistBlood', 'resistPoison', 'resistArcane', 'resistLightning', 'resistFire', 'resistIce')
		}

		// spell power
		if (key === 'addSpellBlood') {
			_.pull(rareKeys, 'addSpellPoison', 'addSpellAll')
		}
		if (key === 'addSpellPoison') {
			_.pull(rareKeys, 'addSpellBlood', 'addSpellAll')
		}
		if (key === 'addSpellArcane') {
			_.pull(rareKeys, 'addSpellLightning', 'addSpellAll')
		}
		if (key === 'addSpellLightning') {
			_.pull(rareKeys, 'addSpellArcane', 'addSpellAll')
		}
		if (key === 'addSpellFire') {
			_.pull(rareKeys, 'addSpellIce', 'addSpellAll')
		}
		if (key === 'addSpellIce') {
			_.pull(rareKeys, 'addSpellFire', 'addSpellAll')
		}
		if (key === 'addSpellAll') {
			_.pull(rareKeys, 'addSpellBlood', 'addSpellPoison', 'addSpellArcane', 'addSpellLightning', 'addSpellFire', 'addSpellIce')
		}

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
		if (key === 'allSkills') {
			_.pull(rareKeys, 'attack', 'offense', 'defense', 'oneHandSlash', 'oneHandBlunt', 'piercing', 'archery', 'handToHand', 'twoHandSlash', 'twoHandBlunt', 'dodge', 'parry', 'riposte', 'alteration', 'conjuration', 'evocation')
		}

		// attributes
		if (key === 'str' ||
			key === 'sta' ||
			key === 'agi' ||
			key === 'dex' ||
			key === 'wis' ||
			key === 'intel' ||
			key === 'cha'
		) {
			_.pull(rareKeys, 'allStats')
		}
		if (key === 'allStats') {
			_.pull(rareKeys, 'str', 'sta', 'agi', 'dex', 'wis', 'intel', 'cha')
		}

		// added magic melee damage
		if (key === 'addIce') {
			_.pull(rareKeys, 'addFire')
		}
		if (key === 'addFire') {
			_.pull(rareKeys, 'addIce')
		}
		if (key === 'addBlood') {
			_.pull(rareKeys, 'addPoison')
		}
		if (key === 'addPoison') {
			_.pull(rareKeys, 'addBlood')
		}
		if (key === 'addArcane') {
			_.pull(rareKeys, 'addLightning')
		}
		if (key === 'addLightning') {
			_.pull(rareKeys, 'addArcane')
		}

		// always pull out prop key
		_.pull(rareKeys, key)
	}
	function setMaxPropValue(obj, key, tc) {
		var MAX_TREASURE_CLASS = 45
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
	function getRareName(itemType, baseName) {
		var prefix = rarePrefixNames[_.random(0, rarePrefixNames.length - 1)]
		var suffix = rareSuffixNames[itemType][_.random(0, rareSuffixNames[itemType].length - 1)]
		return [
			prefix,
			suffix,
			baseName
		].join(' ')
	}
}()