var button;
(function() {
	button = {
		initialized: 0,
		wrap: getById('button-wrap'),
		init,
		hide,
	}
	//////////////////////////////////
	function init() {
		var s = '';
		// skill buttons
		for (var i=0; i<10; i++) {
			s +=
			'<div id="class-btn-'+ i +'" '+
				'class="class-btn" '+
				'style="background-image: url(images/skills/'+ my.job +'.png)"></div>';
		}
		button.wrap.innerHTML = s;
		if (!button.initialized) {
			$("#button-wrap").on('click', '.class-btn', function() {
				var id = this.id.substr(10) * 1;
				console.info('CLICKED SKILL: ', id, typeof id);
				skills[my.job].route(id);
			});
			setTimeout(function() {
				TweenMax.to(button.wrap, 1, {
					startAt: {
						display: 'flex'
					},
					bottom: 0
				});

			}, 1000);
		}
	}
	function hide() {
		TweenMax.set(button.wrap, {
			display: 'none'
		});
	}
})();