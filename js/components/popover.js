var popover;
(function($, parseInt, getComputedStyle, TweenMax, window, undefined) {
	var mainMenuPopovers = {}

	popover = {
		timer: new delayedCall(0, ''),
		isOpen: 0,
		openDate: 0,
		hide,
		show,
		setPosition,
		setMainMenuHtml
	};
	var computedStyle
	var padding
	var width
	var popoverHalfWidth
	var isMenuAbove
	var yAdjust
	let x, y

	let el = getElementById('popover-wrap');
	//////////////////////////////////////////////////

	function setMainMenuHtml(id) {
		if (!id) return;
		mainMenuPopovers = {
			'inv-resist-blood': 'Resist Blood',
			'inv-resist-poison': 'Resist Poison',
			'inv-resist-arcane': 'Resist Arcane',
			'inv-resist-lightning': 'Resist Lightning',
			'inv-resist-fire': 'Resist Fire',
			'inv-resist-ice': 'Resist Ice',
			'bar-msg-sec': 'Messages Sent Per Second',
			'bar-average-ping': 'Last Ping (Average)',
			'bar-camp': 'Camp and Exit',
			'bar-stats': '['+ _.capitalize(ng.config.hotkey.characterStats) +'] Character Sheet',
			'bar-inventory': '['+ _.capitalize(ng.config.hotkey.inventory) +'] Inventory',
			'bar-options': '[ESC] Options',
			'bar-mission-abandon': 'Abandon Mission'
		};
		console.info('setMainMenuHtml', mainMenuPopovers['bar-inventory'])
		var html = mainMenuPopovers[id];
		html && popover.show(html);
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
		if (x < window.innerWidth / 2) {
			el.style.left = x +'px'
		}
		else {
			el.style.left = x +'px'
		}

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

		info('posX', my.mouse.x, popoverHalfWidth)
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
		yAdjust = isMenuAbove ? 15 : (y + 15) * -1
		return my.mouse.y + yAdjust
	}
})($, parseInt, getComputedStyle, TweenMax, window);