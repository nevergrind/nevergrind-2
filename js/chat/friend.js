var friend;
(function() {
	friend = {
		parse,
		init,
		list,
		add,
		remove,
		notify,
	}
	//////////////////////////////////////////
	function parse(o) {
		// 3-part parse
		var a = o.replace(/ +/g, " ").split(" ");
		return a[2][0].toUpperCase() + a[2].substr(1).toLowerCase().trim();
	}
	function init() {
		ng.friends = ng.friends || [];
		$.get(app.url + 'chat/friend-get.php').done(function(data){
			ng.friends = data;
		});
	}
	function list() {
		chat.log('<div class="chat-warning">Checking friends list...</div>');
		if (ng.friends.length){
			$.get(app.url + 'chat/friend-status.php').done(function(r){
				ng.friends = r.friends;
				console.info(r);
				var str = chat.divider + '<div>Friend List ('+ r.friends.length +')</div>';

				ng.friends.forEach(function(name, i){
					var index = r.players.indexOf(name);
					if (index > -1){
						var s = r.stats[index];
						// online
						str +=
							'<div class="chat-whisper">[' +
							s.level +' '+ ng.jobLong[s.job] +'] '+ ng.friends[i] + ' ('+ s.race +
							')' + guild.format(s) + '</div>';
					} else {
						// offline
						str += '<div class="chat-emote">[Offline] ' + name +'</div>';
					}
				});

				chat.log(str);
			});
		}
		else {
			chat.log("<div>You don't have any friends!</div>");
			chat.log("<div class='chat-emote'>Use /friend [name] to add a new friend.</div>");
		}
	}
	function add(o) {
		if (ng.friends.includes(o)) {
			chat.log(o + " is already your friend.", 'chat-warning');
		}
		else if (o.length > 1 && o !== my.name) {
			$.post(app.url + 'chat/friend-add.php', {
				friend: _.toLower(o)
			}).done(function(data){
				if (data.error) {
					chat.log(data.error, 'chat-warning');
				}
				else {
					chat.log('You have added ' + o + ' to your friend list.', 'chat-warning');
					socket.subscribe('friend'+ o, friend.notify);
					if (!ng.friends.includes(o)) {
						socket.publish('name' + o, {
							name: my.name,
							action: "friend>addedMe"
						});
					}

					ng.friends.push(o);
				}
			});
		}
	}
	function remove(o) {
		if (o.length > 1 && o !== my.name && ng.friends.indexOf(o) > -1) {
			$.post(app.url + 'chat/friend-remove.php', {
				friend: _.toLower(o)
			}).done(function(data){
				if (data.error) {
					chat.log(data.error, 'chat-warning');
				}
				else {
					chat.log('You have removed ' + o + ' from your friend list.', 'chat-warning');
					while (ng.friends.indexOf(o) > -1) {
						var index = ng.friends.indexOf(o);
						ng.friends.splice(index, 1);
					}
					socket.unsubscribe('friend'+ o);
				}
			});
		}
	}
	function notify(data, obj) {
		data = router.normalizeInput(data, obj);
		if (data.route === 'on') {
			chat.log(data.name + ' has come online.', 'chat-warning');
		}
		else {
			chat.log(data.name + ' has gone offline.', 'chat-warning');
		}
	}
})();