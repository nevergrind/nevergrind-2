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
	function getItem(mLvl = 1) {
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
		var rarityIndex = 0
		var itemType = rarityTypes[rarityIndex]

		var keys = _.keys(items)
		var filteredKeys = _.filter(keys, filterKeys)
		var len = filteredKeys.length;
		var itemSlot = filteredKeys[_.random(0, len - 1)]

		var itemObj = items[itemSlot]

		var filteredItems = _.filter(itemObj[itemType], filterItems)
		var filteredItemsLen = filteredItems.length
		var filteredItemsIndex = _.random(0, filteredItemsLen - 1)
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
		drop.rarity = rarityTypes[rarityIndex]
		return drop;
		////////////////////////////////////////////////////
		function filterKeys(key) {
			if (rarityIndex === 0) {
				return !slotRequiresMagic.includes(key)
			}
			else {
				return false;
			}
		}
		function filterItems(item) {
			return item.itemLevel <= mLvl
		}
	}
}()