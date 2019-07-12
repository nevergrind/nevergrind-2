// title.js
var title = {
	init: function(){
		$(document).ready(function(){
			// console.info("Initializing title screen...");
			setTimeout(function() {
				ng.initGame();
				game.session.timer = setTimeout(function(){
					ng.keepAlive();
				});
				// init events
				var x = 'mousedown';
				ng.events(x);
				create.events(x);
				audio.events();
			}, 100);
		});
	},
	test: function() {
		// nada
	}
};