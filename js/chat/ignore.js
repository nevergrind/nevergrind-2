var ignore;
(function() {
	ignore = {
		init,
		list,
		add,
		remove,
	};
	//////////////////////////////////////////////////
	function init() {
		storage.get('ignore', ignore => {
			if (Boolean(ignore)) {
				ng.ignore = ignore
			}
		})
		// ng.ignore = JSON.parse(storage.get('ignore')) || ng.ignore;
	}
	function list() {
		if (ng.ignore.length) {
			var s = chat.divider + '<div class="chat-warning">Checking ignore list...</div>';
			ng.ignore.forEach(function(v) {
				s += '<div class="chat-emote">' + v + '</div>';
			});
			chat.log(s);
		}
		else {
			chat.log("Nobody is on your ignore list yet.", CHAT.WARNING);
			chat.log("<div class='chat-emote'>Use /ignore add [name] to ignore a player.</div>", CHAT.WARNING);
		}
	}
	function add(o) {
		if (o !== my.name) {
			ng.ignore.push(o);
			storage.set('ignore', JSON.stringify(ng.ignore));
			chat.log('You have added ' + o + ' to your ignore list.', CHAT.WARNING);
		}
	}
	function remove(o) {
		while (ng.ignore.includes(o)) {
			var index = ng.ignore.indexOf(o);
			ng.ignore.splice(index, 1);
		}
		storage.set('ignore', JSON.stringify(ng.ignore));
		chat.log('You have removed ' + o + ' from your ignore list.', CHAT.WARNING);
	}
})();