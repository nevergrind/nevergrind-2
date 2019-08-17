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
		ng.ignore = JSON.parse(localStorage.getItem('ignore')) || ng.ignore;
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
			chat.log("Nobody is on your friends list yet.", 'chat-warning');
		}
	}
	function add(o) {
		if (o !== my.name) {
			ng.ignore.push(o);
			localStorage.setItem('ignore', JSON.stringify(ng.ignore));
			chat.log('You have added ' + o + ' to your ignore list.', 'chat-warning');
		}
	}
	function remove(o) {
		while (ng.ignore.includes(o)) {
			var index = ng.ignore.indexOf(o);
			ng.ignore.splice(index, 1);
		}
		localStorage.setItem('ignore', JSON.stringify(ng.ignore));
		chat.log('You have removed ' + o + ' from your ignore list.', 'chat-warning');
	}
})();