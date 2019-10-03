var tooltip;
(function() {
	tooltip = {
		timer: new delayedCall(0, ''),
		isOpen: 0,
		openDate: 0,
		hide,
		show,
	};
	var el;
	var wearsLeather = [
		'BRD',
		'CLR',
		'DRU',
		'MNK',
		'PLD',
		'RNG',
		'ROG',
		'SHD',
		'SHM',
		'WAR',
	]
	var wearsMail = [
		'BRD',
		'CLR',
		'PLD',
		'RNG',
		'SHD',
		'SHM',
		'WAR',
	]
	var wearsPlate = [
		'BRD',
		'CLR',
		'PLD',
		'SHD',
		'WAR',
	]
	//////////////////////////////////////////////////
	function show(obj) {
		if (!_.size(obj)) return
		el = getById('tooltip-wrap')
		el.innerHTML = getItemHtml(obj)
		//e.style.top = posY() + 'px'
		//e.style.left = posX() + 'px'
		el.style.visibility = 'visible'
		tooltip.isOpen = 1
		tooltip.openDate = Date.now()
		TweenMax.to(el, .3, {
			opacity: 1,
		})
	}
	function getItemHtml(obj) {
		var html = ''
		html += '<div id="tooltip-name" class="item-' + _.kebabCase(obj.rarity) + '">' + obj.name + '</div>' +
			'<div class="flex space-between capitalize">' +
				'<div>'+ getItemSlot(obj.slots) +'</div>' +
				getRequiredItemSkill(obj) +
			'</div>' +
			getWeaponDamageHtml(obj) +
			(obj.armor ? '<div>'+ obj.armor +' Armor</div>' : '') +
			getStrHtml(obj.str) +
			(obj.itemLevel > 1 ? getRequiredLevelHtml(obj.itemLevel) : '') +
			getDurabilityHtml(obj.durability) +
		'';

		return html
	}
	function getStrHtml(str) {
		return '<div>+' + str +' Strength</div>'
	}
	function getWeaponDamageHtml(obj) {
		if (obj.weaponSkill) {
			var dps = ((obj.minDamage + obj.maxDamage) / obj.speed).toFixed(1);
			return '<div class="flex space-between">' +
				'<div>'+ obj.minDamage + '&thinsp;–&thinsp;' + obj.maxDamage +' Damage</div>' +
				'<div>Speed ' + obj.speed + '</div>' +
			'</div>' +
			'<div>(' + dps + ' damage per second)</div>'
		}
		else {
			return ''
		}
	}
	function getDurabilityHtml(durability) {
		return durability ?
			'<div>Durability ' + durability + '/100</div>' :
			'<div class="item-restricted">Durability ' + durability + '/100</div>'
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
		var level = ~~(itemLevel * .75);
		if (level < 1) level = 1;
		return level
	}
	function getItemSlot(slots) {
		if (slots[1] === 'secondary' && !my.dualWield) {
			slots[1] = '<span class="item-restricted">Secondary</span>'
		}
		return slots.join(' ')
	}
	function getRequiredItemSkill(obj) {
		if (obj.armorType) {
			if (canEquipArmor(obj.armorType)) {
				return '<div>'+ _.startCase(obj.armorType) +'</div>'
			}
			else {
				return '<div class="item-restricted">'+ _.startCase(obj.armorType) +'</div>'
			}
		}
		else if (obj.weaponSkill) {
			if (canEquipWeapon(obj.weaponSkill)) {
				return '<div>'+ _.startCase(obj.weaponSkill) +'</div>'
			}
			else {
				return '<div class="item-restricted">'+ _.startCase(obj.weaponSkill) +'</div>'
			}
		}
		else {
			return ''
		}
	}
	function canEquipArmor(armorType) {
		if (armorType === 'cloth') {
			return true
		}
		else if (armorType === 'leather') {
			return wearsLeather.includes(my.job)
		}
		else if (armorType === 'mail') {
			return wearsMail.includes(my.job)
		}
		else if (armorType === 'plate') {
			return wearsPlate.includes(my.job)
		}
	}
	function canEquipWeapon(weaponSkill) {
		if (weaponSkill === 'One-hand Slash') {
			if (my.oneHandSlash) {
				return true
			}
			else {
				return false
			}
		}
		else if (weaponSkill === 'One-hand Blunt') {
			if (my.oneHandBlunt) {
				return true
			}
			else {
				return false
			}
		}
		else if (weaponSkill === 'Piercing') {
			if (my.piercing) {
				return true
			}
			else {
				return false
			}
		}
		else if (weaponSkill === 'Two-hand Slash') {
			if (my.twoHandSlash) {
				return true
			}
			else {
				return false
			}
		}
		else if (weaponSkill === 'Two-hand Blunt') {
			if (my.twoHandBlunt) {
				return true
			}
			else {
				return false
			}
		}
		else if (weaponSkill === 'Archery') {
			if (my.archery) {
				return true
			}
			else {
				return false
			}
		}
	}
	function hide() {
		el = getById('tooltip-wrap');
		TweenMax.to(el, .2, {
			opacity: 0,
			onComplete: function() {
				el.style.visibility = 'hidden';
				tooltip.isOpen = 0;
			}
		});
	}
	function posX() {
		var el = $('#tooltip-wrap');
		var padding = parseInt(el.css('padding-left'), 10) * 2;
		var tooltipHalfWidth = padding * 2 + el.width() / 2;
		if (my.mouse.x < tooltipHalfWidth) {
			// too small
			my.mouse.x += tooltipHalfWidth / 2;
			if (my.mouse.x < 80) {
				my.mouse.x = 80;
			}
		}
		else if (my.mouse.x > window.innerWidth - tooltipHalfWidth) {
			// too big
			my.mouse.x -= tooltipHalfWidth / 2;
			var z = window.innerWidth - 80;
			if (my.mouse.x > z) {
				my.mouse.x = z;
			}

		}
		return my.mouse.x;
	}
	function posY() {
		// determine Y adjustment
		var verticalOffset = 15;
		var isMenuAbove = my.mouse.y < window.innerHeight / 2;
		var yAdjust = isMenuAbove ? verticalOffset : (~~$("#context-wrap").height() + verticalOffset) * -1;
		return my.mouse.y + yAdjust;
	}
})();