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

		var itemObj = items[itemSlot]
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
		// magic
		if (rarity === 'magic') {
			console.info('this is magic yo')
			processMagicDrop(drop)
		}
		return drop;
		////////////////////////////////////////////////////
		function processMagicDrop(drop) {
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