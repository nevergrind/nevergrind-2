var popover;
(function() {
	var mainMenuPopovers = {
		'bar-last-ping': 'Last Ping',
		'bar-average-ping': 'Average Ping',
		'bar-camp': 'Camp and Exit',
		'bar-stats': 'Character Sheet',
		'bar-inventory': 'Inventory',
		'bar-options': 'Options',
		'bar-mission-abandon': 'Abandon Mission'
	};

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
	//////////////////////////////////////////////////

	function setMainMenuHtml(id) {
		if (!id) return;
		var html = mainMenuPopovers[id];
		html && popover.show(html);
	}
	function show(html) {
		if (!html) return;
		el = getById('popover-wrap');
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
		el = getById('popover-wrap');
		TweenMax.set(el, {
			opacity: 0,
			onComplete: function() {
				el.style.visibility = 'hidden';
				popover.isOpen = 0;
			}
		});
	}
	function posX() {
		el = getById('popover-wrap')
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
		var yAdjust = isMenuAbove ?
			verticalOffset : (~~$("#context-wrap").height() + verticalOffset) * -1;
		return my.mouse.y + yAdjust;
	}
})();