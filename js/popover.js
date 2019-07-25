var popover;
(function() {
	var mainMenuPopovers = {
		'bar-camp': 'Camp and Exit',
		'bar-stats': 'Character Sheet',
		'bar-inventory': 'Inventory',
		'bar-options': 'Options',
		'bar-mission-abandon': 'Abandon Mission'
	};

	popover = {
		timer: 0,
		isOpen: 0,
		openDate: 0,
		hide: hide,
		show: show,
		setMainMenuHtml: setMainMenuHtml
	};
	//////////////////////////////////////////////////

	function setMainMenuHtml(id) {
		console.info('id', id);
		if (!id) return;
		var html = mainMenuPopovers[id];
		html && popover.show(html);
	}
	function show(html) {
		if (!html) return;
		var e = getById('popover-wrap');
		e.innerHTML = html;
		e.style.top = posY() + 'px';
		e.style.left = posX() + 'px';
		e.style.visibility = 'visible';
		popover.isOpen = 1;
		popover.openDate = Date.now();
		TweenMax.to(e, .3, {
			opacity: 1,
		});
	}
	function hide() {
		var el = getById('popover-wrap');
		TweenMax.to(el, .2, {
			opacity: 0,
			onComplete: function() {
				el.style.visibility = 'hidden';
				popover.isOpen = 0;
			}
		});
	}
	function posX() {
		var el = $('#popover-wrap');
		var padding = parseInt(el.css('padding-left'), 10) * 2;
		var popoverHalfWidth = padding * 2 + el.width() / 2;
		console.info('popoverHalfWidth', popoverHalfWidth);
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
		var yAdjust = isMenuAbove ? verticalOffset : (~~$("#context-wrap").height() + verticalOffset) * -1;
		return my.mouse.y + yAdjust;
	}
})();