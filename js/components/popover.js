var popover;
(function($, parseInt, getComputedStyle, TweenMax, _, undefined) {
	var mainMenuPopovers = {}

	popover = {
		timer: new delayedCall(0, ''),
		isOpen: 0,
		openDate: 0,
		lastHoverId: '',
		hide,
		show,
		setPosition,
		setPopoverHtml
	};
	var computedStyle
	var padding
	var width
	var popoverHalfWidth
	var isMenuAbove
	var yAdjust
	let x, y
	let html
	let buffName
	let index

	let el = getElementById('popover-wrap');
	//////////////////////////////////////////////////

	function setPopoverHtml(id) {
		if (!id || map.isDragging) return;
		popover.lastHoverId = id
		mainMenuPopovers = {
			'inv-resist-blood': 'Resist Blood',
			'inv-resist-poison': 'Resist Poison',
			'inv-resist-arcane': 'Resist Arcane',
			'inv-resist-lightning': 'Resist Lightning',
			'inv-resist-fire': 'Resist Fire',
			'inv-resist-ice': 'Resist Ice',
			'bar-msg-sec': 'Messages Sent Per Second',
			'bar-average-ping': 'Last and Average Ping',
			'bar-camp': 'Camp and Exit',
			'bar-stats': '['+ _.capitalize(ng.config.hotkey.characterStats) +'] Character Sheet',
			'bar-inventory': '['+ _.capitalize(ng.config.hotkey.inventory) +'] Inventory',
			'bar-options': '[ESC] Options',
			'potion-hp': 'Use Health Potion',
			'potion-mp': 'Use Mana Potion',
			'potion-sp': 'Use Spirit Potion',
			'potion-hp-empty': 'No Health Potions Remain',
			'potion-mp-empty': 'No Mana Potions Remain',
			'potion-sp-empty': 'No Spirit Potions Remain',
			'mini-map-party': 'Center Camera on Party',
			'quest-completed': 'Click to Return to Town',
		}
		if (id.startsWith('skill-')) {
			if (id === 'skill-primary-attack-btn') html = 'Primary Attack'
			else if (id === 'skill-secondary-attack-btn') html = 'Secondary Attack'
			else {
				// job skills
				index = +id.split('-')[1]
				html = skills[my.job][index].name
			}
		}
		else if (id.startsWith('buff-')) {
			buffName = _.camelCase(id.split('-')[1])
			// console.info('buffName', buffName)
			html = buffs[buffName].name
		}
		else if (id.startsWith('mybuff-')) {
			buffName = _.camelCase(id.split('-')[1])
			html = buffs[buffName].name || _.startCase(buffName)
		}
		else {
			if (id === 'potion-hp') {
				if (button.hasPotionByType('hp')) id = 'potion-hp-empty'
			}
			else if (id === 'potion-mp') {
				if (button.hasPotionByType('mp')) id = 'potion-mp-empty'
			}
			else if (id === 'potion-sp') {
				if (button.hasPotionByType('sp')) id = 'potion-sp-empty'
			}
			html = mainMenuPopovers[id]
		}
		// console.info('setPopoverHtml', mainMenuPopovers['bar-inventory'])
		html && popover.show(html)
	}
	function show(html) {
		if (!html) return
		el.innerHTML = html
		setPosition()
		el.style.visibility = 'visible'
		popover.isOpen = 1
		popover.openDate = Date.now()
		TweenMax.set(el, {
			opacity: 1,
		})
	}
	function setPosition() {
		computedStyle = getComputedStyle(el)
		el.style.top = posY(computedStyle) + 'px'
		x = posX(computedStyle)
		if (x < window.innerWidth / 2) el.style.left = x +'px'
		else el.style.left = x +'px'
	}
	function hide() {
		TweenMax.set(el, {
			opacity: 0,
			onComplete: function() {
				el.style.visibility = 'hidden';
				popover.isOpen = 0;
			}
		});
	}
	function posX(style) {
		padding = parseInt(style.paddingLeft, 10) * 2
		width = parseInt(style.width, 10)
		popoverHalfWidth = (padding + width) / 2

		// console.info('posX', my.mouse.x, popoverHalfWidth)
		if (my.mouse.x < popoverHalfWidth + 10) {
			my.mouse.x = popoverHalfWidth + 10
		}
		else if (my.mouse.x > window.innerWidth - popoverHalfWidth - 10) {
			// too big
			my.mouse.x = window.innerWidth - popoverHalfWidth - 10
		}
		return my.mouse.x
	}

	function posY(style) {
		// determine Y adjustment
		y = parseInt(style.height, 10)
		isMenuAbove = my.mouse.y < window.innerHeight / 2
		yAdjust = isMenuAbove ? 15 : (y + 25) * -1
		return my.mouse.y + yAdjust
	}
})($, parseInt, getComputedStyle, TweenMax, _);