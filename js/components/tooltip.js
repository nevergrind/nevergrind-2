var tooltip;
(function() {
	tooltip = {
		timer: new delayedCall(0, ''),
		isOpen: 0,
		openDate: 0,
		hide,
		show
	};
	//////////////////////////////////////////////////
	function show(html) {
		if (!html) return;
		var e = getById('tooltip-wrap');
		e.innerHTML = html;
		e.style.top = posY() + 'px';
		e.style.left = posX() + 'px';
		e.style.visibility = 'visible';
		tooltip.isOpen = 1;
		tooltip.openDate = Date.now();
		TweenMax.to(e, .3, {
			opacity: 1,
		});
	}
	function hide() {
		var el = getById('tooltip-wrap');
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