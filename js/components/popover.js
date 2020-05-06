var popover;
(function() {
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
	var el
	var style
	var padding
	var width
	var popoverHalfWidth
	var innerWidth
	var verticalOffset
	var isMenuAbove
	var yAdjust
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
			'bar-last-ping': 'Last Ping',
			'bar-average-ping': 'Average Ping',
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
		if (!html) return;
		el = getElementById('popover-wrap');
		el.innerHTML = html;
		setPosition()
		el.style.visibility = 'visible';
		popover.isOpen = 1;
		popover.openDate = Date.now();
		TweenMax.set(el, {
			opacity: 1,
		});
	}
	function setPosition() {
		el.style.top = posY() + 'px';
		el.style.left = posX() + 'px';
	}
	function hide() {
		el = getElementById('popover-wrap');
		TweenMax.set(el, {
			opacity: 0,
			onComplete: function() {
				el.style.visibility = 'hidden';
				popover.isOpen = 0;
			}
		});
	}
	function posX() {
		el = getElementById('popover-wrap')
		style = getComputedStyle(el)
		padding = parseInt(style.paddingLeft, 10) * 2
		width = parseInt(style.width, 10)
		popoverHalfWidth = (padding * 2) + width / 2;
		if (my.mouse.x < popoverHalfWidth) {
			// too small
			my.mouse.x += popoverHalfWidth / 2;
			if (my.mouse.x < 80) {
				my.mouse.x = 80;
			}
		}
		else if (my.mouse.x > window.innerWidth - popoverHalfWidth) {
			// too big
			my.mouse.x -= popoverHalfWidth / 2;
			innerWidth = window.innerWidth - 80;
			if (my.mouse.x > innerWidth) {
				my.mouse.x = innerWidth
			}

		}
		return my.mouse.x;
	}

	function posY() {
		// determine Y adjustment
		verticalOffset = 15;
		isMenuAbove = my.mouse.y < window.innerHeight / 2;
		yAdjust = isMenuAbove ?
			verticalOffset : (~~$("#context-wrap").height() + verticalOffset) * -1;
		return my.mouse.y + yAdjust;
	}
})();